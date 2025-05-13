import { Request, Response } from 'express'
import { getChatResponse } from '../services/chatService'
console.log('Chat Controller Initialized')

export const askQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('askQuestion controller called')
  try {
    const { question, pdfId } = req.body

    if (!question || !pdfId) {
      res.status(400).json({
        success: false,
        message: 'Both question and PDF ID are required.',
      })
      return
    }

    const chatResponse = await getChatResponse(question, pdfId)

    res.status(200).json({
      success: true,
      data: chatResponse,
    })
  } catch (error: any) {
    console.error('Error in askQuestion controller:', error.message)
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.',
      error: error.message,
    })
  }
}
