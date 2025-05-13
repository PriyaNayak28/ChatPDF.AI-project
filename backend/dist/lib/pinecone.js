"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pineconeIndex = exports.pinecone = void 0;
exports.verifyIndexConfiguration = verifyIndexConfiguration;
const pinecone_1 = require("@pinecone-database/pinecone");
if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not set');
}
if (!process.env.PINECONE_INDEX_NAME) {
    throw new Error('PINECONE_INDEX_NAME is not set');
}
exports.pinecone = new pinecone_1.Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});
exports.pineconeIndex = exports.pinecone.Index(process.env.PINECONE_INDEX_NAME);
async function verifyIndexConfiguration() {
    try {
        const indexDescription = await exports.pinecone.describeIndex(process.env.PINECONE_INDEX_NAME);
        console.log('Current index configuration:', indexDescription);
        return indexDescription;
    }
    catch (error) {
        console.error('Error verifying index configuration:', error);
        throw error;
    }
}
