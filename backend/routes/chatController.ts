import { storeEmbeddingsToPinecone } from '../services/storeEmbeddings'
import { queryPinecone } from '../services/queryEmbeddings'

await storeEmbeddingsToPinecone(pdfId, userId, chunks, embeddings)

const embedding = await generateOpenAIEmbedding(userQuestion)
const results = await queryPinecone(embedding)
