import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})

export async function setupPineconeIndex() {
  try {
    // Delete existing index if it exists
    try {
      await pinecone.deleteIndex(process.env.PINECONE_INDEX_NAME!)
      console.log('Deleted existing index')
    } catch (error) {
      console.log('No existing index to delete')
    }

    // Create new index with correct dimension
    await pinecone.createIndex({
      name: process.env.PINECONE_INDEX_NAME!,
      dimension: 384, // Match the dimension of all-MiniLM-L6-v2 embeddings
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-west-2',
        },
      },
    })

    console.log('Created new index with dimension 384')
  } catch (error) {
    console.error('Error setting up Pinecone index:', error)
    throw error
  }
} 