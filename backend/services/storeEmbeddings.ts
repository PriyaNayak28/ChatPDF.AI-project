import pinecone from '../pinecone'

export const storeEmbeddingsToPinecone = async (
  pdfId: string,
  userId: string,
  chunks: string[],
  embeddings: number[][]
) => {
  try {
    const index = pinecone.Index('pdf-embeddings')

    const vectors = chunks.map((chunk, i) => ({
      id: `${pdfId}_${i}`,
      values: embeddings[i],
      metadata: {
        text: chunk,
        userId,
        pdfId,
        chunkIndex: i,
      },
    }))

    await index.upsert(vectors)
    return { success: true }
  } catch (error: any) {
    console.error('Error storing embeddings to Pinecone:', error)
    throw new Error(`Failed to store embeddings: ${error?.message || 'Unknown error'}`)
  }
}
