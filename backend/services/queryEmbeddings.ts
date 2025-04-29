import pinecone from '../pinecone'

export const queryPinecone = async (embedding: number[], topK = 5) => {
  try {
    const index = pinecone.Index('pdf-embeddings')

    const result = await index.query({
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
