import { pipeline } from '@xenova/transformers'

let extractor: any

export async function loadEmbedder() {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return extractor
}

export async function embedText(text: string): Promise<number[]> {
  try {
    const embedder = await loadEmbedder()
    const output = await embedder(text, {
      pooling: 'mean',
      normalize: true,
    })

    let vector: number[]
    if (Array.isArray(output.data)) {
      vector = output.data.map(Number)
    } else if (output.data && typeof output.data === 'object') {
      const values = Object.values(output.data)
      vector = values.flat().map(Number)
    } else {
      throw new Error('Unexpected embedding format')
    }

    if (
      !Array.isArray(vector) ||
      vector.length === 0 ||
      vector.some((v) => typeof v !== 'number' || isNaN(v))
    ) {
      throw new Error('Invalid embedding format')
    }

    return vector
  } catch (error) {
    console.error('Error generating embedding:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    throw new Error(`Failed to generate embedding: ${errorMessage}`)
  }
}
