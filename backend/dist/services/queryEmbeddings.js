"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryPinecone = void 0;
const pinecone_1 = require("../lib/pinecone");
const queryPinecone = async (embedding, topK = 5) => {
    try {
        if (!embedding || embedding.length === 0) {
            throw new Error('Embedding vector is empty');
        }
        if (topK <= 0) {
            throw new Error('Invalid value for topK: must be > 0');
        }
        const result = await pinecone_1.pineconeIndex.query({
            vector: embedding,
            topK,
            includeMetadata: true,
        });
        return result.matches;
    }
    catch (error) {
        console.error('Error querying Pinecone:', error);
        throw new Error(`Failed to query embeddings: ${error.message}`);
    }
};
exports.queryPinecone = queryPinecone;
