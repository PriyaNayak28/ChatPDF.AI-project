import { Request, Response } from 'express'
import { getChatResponse } from '../services/chatService'

export const askQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, pdfId } = req.body

    if (!question || !pdfId) {
      res.status(400).json({
        success: false,
        message: 'Question and PDF ID are required'
      })
      return
    }

    const response = await getChatResponse(question, pdfId)
    
    res.status(200).json({
      success: true,
      data: response
    })
  } catch (error: any) {
    console.error('Error in chat controller:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
} 