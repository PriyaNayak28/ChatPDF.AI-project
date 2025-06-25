import { Request, Response, NextFunction } from 'express'
import pdfParse from 'pdf-parse'
import axios from 'axios'
import { embedText } from '../util/embedding'
import PDF from '../models/pdf'
import { v4 as uuidv4 } from 'uuid'
import { storeEmbeddingsToPinecone } from '../services/storeEmbeddings'

function chunkText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 100
): string[] {
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    const chunk = text.slice(i, i + chunkSize)
    chunks.push(chunk)
  }
  return chunks
}

export const uploadPDF = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' })
    }

    const fileUrl = (req.file as any).path
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' })
    const dataBuffer = Buffer.from(response.data as ArrayLike<number>)
    const pdfData = await pdfParse(dataBuffer)
    const extractedText = pdfData.text
    const chunks = chunkText(extractedText, 1000, 100)
    const updatedFilename = req.file.filename

    await Promise.all(chunks.map((chunk) => embedText(chunk)))

    const pdf = await PDF.create({
      id: uuidv4(),
      userId: userId,
      storedFilename: updatedFilename,
      originalFilename: req.file.originalname,
      filePath: fileUrl,
      uploadDate: new Date(),
    })
    console.log('PDF created:', pdf)

    await storeEmbeddingsToPinecone(pdf.id, userId.toString(), chunks)

    res.json({
      success: true,
      data: {
        pdfId: pdf.id,
        message: 'PDF uploaded and processed successfully',
      },
    })
  } catch (error) {
    console.error('Error processing PDF:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    res
      .status(500)
      .json({ message: 'Error processing PDF', error: errorMessage })
  }
}

export const getUserPDFs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' })
    }

    const pdfs = await PDF.findAll({
      where: { userId },
      order: [['uploadDate', 'DESC']],
    })

    res.json({ success: true, data: pdfs })
  } catch (error) {
    console.error('Error fetching PDFs:', error)
    res.status(500).json({ message: 'Error fetching PDFs' })
  }
}

export const getPDFById = async (req: Request, res: Response) => {
  const id = req.params.id
  console.log('Fetching PDF with ID:', id)

  try {
    const pdf = await PDF.findByPk(id)
    console.log('PDF found:', pdf)
    console.log('PDF filePath:', pdf?.filePath)

    if (!pdf) {
      console.log('PDF not found for ID:', id)
      return res.status(404).json({ 
        success: false,
        message: 'PDF not found' 
      })
    }

    if (!pdf.filePath) {
      console.log('PDF filePath is empty for ID:', id)
      return res.status(404).json({ 
        success: false,
        message: 'PDF file path is missing' 
      })
    }

    const responseData = {
      success: true,
      data: {
        pdfUrl: pdf.filePath,
      },
    }
    console.log('Sending response:', responseData)

    res.json(responseData)
  } catch (error) {
    console.error('Error fetching PDF:', error)
    res.status(500).json({ 
      success: false,
      message: 'Error fetching PDF' 
    })
  }
}
