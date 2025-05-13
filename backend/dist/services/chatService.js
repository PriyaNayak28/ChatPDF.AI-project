"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatResponse = void 0;
const axios_1 = __importDefault(require("axios"));
const queryEmbeddings_1 = require("./queryEmbeddings");
const embedding_1 = require("../util/embedding");
require("dotenv/config");
const getChatResponse = async (question, pdfId) => {
    try {
        if (!process.env.GROQ_API_KEY) {
            throw new Error('Groq API key is not configured');
        }
        const questionEmbedding = await (0, embedding_1.embedText)(question);
        const relevantChunks = await (0, queryEmbeddings_1.queryPinecone)(questionEmbedding, 8);
        if (!relevantChunks || relevantChunks.length === 0) {
            throw new Error('No relevant content found in the PDF');
        }
        console.log('Retrieved chunks:', relevantChunks.length);
        if (relevantChunks[0] && relevantChunks[0].metadata) {
            console.log('First chunk score:', relevantChunks[0].score);
            console.log('First chunk text:', relevantChunks[0].metadata.text);
        }
        const context = relevantChunks
            .map((chunk) => chunk.metadata.text)
            .join('\n\n');
        console.log('Context being sent to AI:', context);
        console.log('Question being asked:', question);
        const prompt = `You are a helpful assistant analyzing a PDF document. Your task is to answer questions based on the provided context from the PDF.

Context from the PDF:
${context}

Question: ${question}

Instructions:
1. First, carefully analyze the context to find relevant information
2. If you find relevant information, provide a detailed answer
3. If you're not completely sure but see some related information, share what you found
4. Only if you truly cannot find ANY relevant information, say "I cannot find the answer in the provided context"

Please provide your answer:`;
        const response = await axios_1.default.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama-3.3-70b-versatile',
            // model: 'mixtral-8x7b-32768', //'llama3-70b-8192'
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant. Use the provided context to answer the question.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.5,
            max_tokens: 1024,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('response.data', response.data);
        const text = response.data.choices[0]?.message?.content;
        if (!text) {
            throw new Error('Empty response received from Groq API');
        }
        return {
            answer: text,
            context: relevantChunks.map((chunk) => ({
                text: chunk.metadata.text,
                score: chunk.score,
            })),
        };
    }
    catch (error) {
        console.error('Error in chat service:', error);
        throw new Error(`Failed to get chat response: ${error.message}`);
    }
};
exports.getChatResponse = getChatResponse;
