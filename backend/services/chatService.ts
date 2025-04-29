import OpenAI from 'openai'
import { queryPinecone } from './queryEmbeddings'
import { embedText } from '../util/pinecone'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const getChatResponse = async (question: string, pdfId: string) => {
  try {
    const questionEmbedding = await embedText(question)

    const relevantChunks = await queryPinecone(questionEmbedding, 3)

    const context = relevantChunks
      .map((chunk: any) => chunk.metadata.text)
      .join('\n\n')

    const prompt = `Based on the following context from a PDF document, please answer the question. If the answer cannot be found in the context, say "I cannot find the answer in the provided context."

Context:
${context}

Question: ${question}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that answers questions based on the provided context from PDF documents.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return {
      answer: completion.choices[0].message?.content,
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
