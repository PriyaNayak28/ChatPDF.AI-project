import { pineconeIndex } from '../lib/pinecone'

export const queryPinecone = async (embedding: number[], topK = 5) => {
  try {
    if (!embedding || embedding.length === 0) {
      throw new Error('Embedding vector is empty')
    }

    if (topK <= 0) {
      throw new Error('Invalid value for topK: must be > 0')
    }

    const result = await pineconeIndex.query({
      vector: embedding,
      topK,
      includeMetadata: true,
    })

    return result.matches
  } catch (error: any) {
    console.error('Error querying Pinecone:', error)
    throw new Error(`Failed to query embeddings: ${error.message}`)
  }
}
