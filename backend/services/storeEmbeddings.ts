// import { pineconeIndex } from '../lib/pinecone'

// export const storeEmbeddingsToPinecone = async (
//   pdfId: string,
//   userId: string,
//   chunks: string[],
//   embeddings: number[][]
// ) => {
//   try {
//     const vectors = chunks.map((chunk, i) => {
//       const embedding = embeddings[i]

//       if (!Array.isArray(embedding) || typeof embedding[0] !== 'number') {
//         throw new Error(`Invalid embedding at index ${i}`)
//       }

//       return {
//         id: `${pdfId}_${i}`,
//         values: embedding,
//         metadata: {
//           text: chunk,
//           userId,
//           pdfId,
//           chunkIndex: i,
//         },
//       }
//     })

//     await pineconeIndex.upsert(vectors)
//     return { success: true }
//   } catch (error: any) {
//     console.error('Error storing embeddings to Pinecone:', error)
//     throw new Error(`Failed to store embeddings: ${error.message}`)
//   }
// }

import { pipeline } from '@xenova/transformers'
import { pineconeIndex } from '../lib/pinecone'

let extractor: any

// Load the embedder once
export async function loadEmbedder() {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return extractor
}

// Embed a single text and return a flat array of numbers
export async function embedText(text: string): Promise<number[]> {
  const embedder = await loadEmbedder()
  const embedding = await embedder(text, {
    pooling: 'mean',
    normalize: true,
  })

  // Handle different possible output formats
  let vector: number[]
  if (Array.isArray(embedding.data)) {
    // If data is already an array
    vector = embedding.data
  } else if (embedding.data && typeof embedding.data === 'object') {
    // If data is an object with array values
    vector = Object.values(embedding.data)
  } else {
    throw new Error('Unexpected embedding format')
  }

  // Validate the vector
  if (!Array.isArray(vector) || vector.length === 0 || typeof vector[0] !== 'number') {
    throw new Error('Embedding is not a valid vector')
  }

  return vector
}

// Store embeddings and metadata to Pinecone
export const storeEmbeddingsToPinecone = async (
  pdfId: string,
  userId: string,
  chunks: string[]
) => {
  try {
    // ✅ Generate embeddings correctly using Promise.all
    const embeddings: number[][] = await Promise.all(
      chunks.map((chunk) => embedText(chunk))
    )

    const vectors = chunks.map((chunk, i) => {
      const embedding = embeddings[i]
      console.log(`Embedding at index ${i}:`, embedding)

      if (!Array.isArray(embedding) || typeof embedding[0] !== 'number') {
        throw new Error(`Invalid embedding at index ${i}`)
      }

      return {
        id: `${pdfId}_${i}`,
        values: embedding,
        metadata: {
          text: chunk,
          userId,
          pdfId,
          chunkIndex: i,
        },
      }
    })

    await pineconeIndex.upsert(vectors)
    return { success: true }
  } catch (error: any) {
    console.error('Error storing embeddings to Pinecone:', error)
    throw new Error(`Failed to store embeddings: ${error.message}`)
  }
}
