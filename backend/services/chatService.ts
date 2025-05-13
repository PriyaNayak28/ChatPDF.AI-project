import axios from 'axios'
import { queryPinecone } from './queryEmbeddings'
import { embedText } from '../util/embedding'
import 'dotenv/config'

export const getChatResponse = async (question: string, pdfId: string) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('Groq API key is not configured')
    }
    const questionEmbedding = await embedText(question)
    const relevantChunks = await queryPinecone(questionEmbedding, 8)

    if (!relevantChunks || relevantChunks.length === 0) {
      throw new Error('No relevant content found in the PDF')
    }

    console.log('Retrieved chunks:', relevantChunks.length)
    if (relevantChunks[0] && relevantChunks[0].metadata) {
      console.log('First chunk score:', relevantChunks[0].score)
      console.log('First chunk text:', relevantChunks[0].metadata.text)
    }
    
    const context = relevantChunks
      .map((chunk: any) => chunk.metadata.text)
      .join('\n\n')

    console.log('Context being sent to AI:', context)
    console.log('Question being asked:', question)

    const prompt = `You are a helpful assistant analyzing a PDF document. Your task is to answer questions based on the provided context from the PDF.

Context from the PDF:
${context}

Question: ${question}

Instructions:
1. First, carefully analyze the context to find relevant information
2. If you find relevant information, provide a detailed answer
3. If you're not completely sure but see some related information, share what you found
4. Only if you truly cannot find ANY relevant information, say "I cannot find the answer in the provided context"

Please provide your answer:`

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        // model: 'mixtral-8x7b-32768', //'llama3-70b-8192'
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant. Use the provided context to answer the question.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )
    console.log('response.data', response.data)

    const text = response.data.choices[0]?.message?.content

    if (!text) {
      throw new Error('Empty response received from Groq API')
    }

    return {
      answer: text,
      context: relevantChunks.map((chunk: any) => ({
        text: chunk.metadata.text,
        score: chunk.score,
      })),
    }
  } catch (error: any) {
    console.error('Error in chat service:', error)
    throw new Error(`Failed to get chat response: ${error.message}`)
  }
}
