"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const setupPinecone_1 = require("../lib/setupPinecone");
const pinecone_1 = require("../lib/pinecone");
dotenv_1.default.config();
async function main() {
    try {
        try {
            const currentConfig = await (0, pinecone_1.verifyIndexConfiguration)();
            console.log('Current index configuration:', currentConfig);
        }
        catch (error) {
            console.log('No existing index found, will create new one');
        }
        await (0, setupPinecone_1.setupPineconeIndex)();
        const newConfig = await (0, pinecone_1.verifyIndexConfiguration)();
        console.log('New index configuration:', newConfig);
        console.log('Pinecone setup completed successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('Failed to setup Pinecone:', error);
        process.exit(1);
    }
}
main();
