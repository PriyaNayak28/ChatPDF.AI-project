import { pineconeIndex } from '../lib/pinecone'

export const queryPinecone = async (embedding: number[], topK = 5) => {
  try {
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
