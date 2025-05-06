import { GoogleGenerativeAI } from '@google/generative-ai'
import { queryPinecone } from './queryEmbeddings'
import { embedText } from '../util/embedding'
import 'dotenv/config'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

export const getChatResponse = async (question: string, pdfId: string) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured')
    }

    const questionEmbedding = await embedText(question)
    const relevantChunks = await queryPinecone(questionEmbedding, 3)

    if (!relevantChunks || relevantChunks.length === 0) {
      throw new Error('No relevant content found in the PDF')
    }

    const context = relevantChunks
      .map((chunk: any) => chunk.metadata.text)
      .join('\n\n')

    const prompt = `Based on the following context from a PDF document, please answer the question. If the answer cannot be found in the context, say "I cannot find the answer in the provided context."

Context:
${context}

Question: ${question}`

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    })

    if (!result.response) {
      throw new Error('No response received from Gemini AI')
    }

    const text = result.response.text()
    if (!text) {
      throw new Error('Empty response received from Gemini AI')
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
