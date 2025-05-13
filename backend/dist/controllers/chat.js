"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askQuestion = void 0;
const chatService_1 = require("../services/chatService");
console.log('Chat Controller Initialized');
const askQuestion = async (req, res) => {
    console.log('askQuestion controller called');
    try {
        const { question, pdfId } = req.body;
        if (!question || !pdfId) {
            res.status(400).json({
                success: false,
                message: 'Both question and PDF ID are required.',
            });
            return;
        }
        const chatResponse = await (0, chatService_1.getChatResponse)(question, pdfId);
        res.status(200).json({
            success: true,
            data: chatResponse,
        });
    }
    catch (error) {
        console.error('Error in askQuestion controller:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request.',
            error: error.message,
        });
    }
};
exports.askQuestion = askQuestion;
