import { pipeline } from '@xenova/transformers'

let extractor: any

export async function loadEmbedder() {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return extractor
}

export async function embedText(text: string) {
  const embedder = await loadEmbedder()
  const embedding = await embedder(text, {
    pooling: 'mean',
    normalize: true,
  })
  return embedding.data
}
