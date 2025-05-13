"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeEmbeddingsToPinecone = void 0;
exports.loadEmbedder = loadEmbedder;
exports.embedText = embedText;
const transformers_1 = require("@xenova/transformers");
const pinecone_1 = require("../lib/pinecone");
let extractor;
async function loadEmbedder() {
    if (!extractor) {
        extractor = await (0, transformers_1.pipeline)('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return extractor;
}
async function embedText(text) {
    const embedder = await loadEmbedder();
    const embedding = await embedder(text, {
        pooling: 'mean',
        normalize: true,
    });
    let vector;
    if (Array.isArray(embedding.data)) {
        vector = embedding.data;
    }
    else if (embedding.data && typeof embedding.data === 'object') {
        vector = Object.values(embedding.data);
    }
    else {
        throw new Error('Unexpected embedding format');
    }
    if (!Array.isArray(vector) ||
        vector.length === 0 ||
        typeof vector[0] !== 'number') {
        throw new Error('Embedding is not a valid vector');
    }
    return vector;
}
const storeEmbeddingsToPinecone = async (pdfId, userId, chunks) => {
    try {
        const embeddings = await Promise.all(chunks.map((chunk) => embedText(chunk)));
        const vectors = chunks.map((chunk, i) => {
            const embedding = embeddings[i];
            console.log(`Embedding at index ${i}:`, embedding);
            if (!Array.isArray(embedding) || typeof embedding[0] !== 'number') {
                throw new Error(`Invalid embedding at index ${i}`);
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
            };
        });
        await pinecone_1.pineconeIndex.upsert(vectors);
        return { success: true };
    }
    catch (error) {
        console.error('Error storing embeddings to Pinecone:', error);
        throw new Error(`Failed to store embeddings: ${error.message}`);
    }
};
exports.storeEmbeddingsToPinecone = storeEmbeddingsToPinecone;
