const { CohereClient } = require('cohere-ai')

if (!process.env.COHERE_API_KEY) {
  throw new Error('COHERE_API_KEY environment variable is not set')
}

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
})

export async function embedText(text: string): Promise<number[]> {
  const response = await cohere.embed({
    texts: [text],
    model: 'embed-english-light-v3.0',
    input_type: 'search_document',
  })

  if (
    !response.embeddings ||
    !Array.isArray(response.embeddings) ||
    response.embeddings.length === 0
  ) {
    throw new Error('Invalid response format from Cohere API')
  }

  return response.embeddings[0]
}
