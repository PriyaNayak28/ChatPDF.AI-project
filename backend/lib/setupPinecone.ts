import { Pinecone } from '@pinecone-database/pinecone'

if (!process.env.PINECONE_API_KEY) {
  throw new Error('PINECONE_API_KEY is not set')
}

if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error('PINECONE_INDEX_NAME is not set')
}

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
})

export async function setupPineconeIndex() {
  try {
    const indexName = process.env.PINECONE_INDEX_NAME!
    const existingIndexes = await pinecone.listIndexes()
    const indexExists = existingIndexes.indexes?.some(
      (index: { name: string }) => index.name === indexName
    )

    if (indexExists) {
      console.log(`Index ${indexName} already exists`)
      return
    }
    await pinecone.createIndex({
      name: indexName,
      dimension: 384,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          // region: 'us-west-2',
          region: 'us-east-1',
        },
      },
    })

    console.log(`Created new index: ${indexName}`)
  } catch (error) {
    console.error('Error setting up Pinecone index:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    throw new Error(`Failed to setup Pinecone index: ${errorMessage}`)
  }
}
