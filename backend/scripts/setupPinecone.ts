import dotenv from 'dotenv'
import { setupPineconeIndex } from '../lib/setupPinecone'
import { verifyIndexConfiguration } from '../lib/pinecone'

dotenv.config()

async function main() {
  try {
    try {
      const currentConfig = await verifyIndexConfiguration()
      console.log('Current index configuration:', currentConfig)
    } catch (error) {
      console.log('No existing index found, will create new one')
    }

    await setupPineconeIndex()

    const newConfig = await verifyIndexConfiguration()
    console.log('New index configuration:', newConfig)

    console.log('Pinecone setup completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Failed to setup Pinecone:', error)
    process.exit(1)
  }
}

main()
