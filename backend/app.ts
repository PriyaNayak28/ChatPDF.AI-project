import express, { Application } from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import session from 'express-session'
import passport from 'passport'
import multer from 'multer'
import fs from 'fs'
import pdfParse from 'pdf-parse'

import './passport/github'
import userRoutes from './routes/user'
import premiumRoutes from './routes/premium'
import authRoutes from './routes/auth'
import chatRoutes from './routes/chatRoutes'
import { embedText } from './util/pinecone'
import dotenv from 'dotenv'
import PDF from './models/pdf'
import { v4 as uuidv4 } from 'uuid'
import { storeEmbeddingsToPinecone } from './services/storeEmbeddings'

dotenv.config()

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File
    }
  }
}

dotenv.config()

const app: Application = express()

app.use(cors({ origin: '*', credentials: true }))
app.use(bodyParser.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false,
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'views')))

app.use('/user', userRoutes)
app.use('/auth', authRoutes)
app.use('/premium', premiumRoutes)
app.use('/api/chat', chatRoutes)

import sequelize from './util/database'
import User from './models/user'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})
const upload = multer({ storage })

function chunkText(
  text: string,
  chunkSize: number = 500,
  overlap: number = 50
): string[] {
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    const chunk = text.slice(i, i + chunkSize)
    chunks.push(chunk)
  }
  return chunks
}

app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' })
      return
    }

    const userId = req.user?.id
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' })
      return
    }

    const filePath = req.file.path
    const dataBuffer = fs.readFileSync(filePath)
    const pdfData = await pdfParse(dataBuffer)

    const extractedText = pdfData.text
    const chunks = chunkText(extractedText, 500, 50)

    const embeddings = await Promise.all(
      chunks.map((chunk) => embedText(chunk))
    )

    const pdf = await PDF.create({
      id: uuidv4(),
      userId: userId.toString(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      uploadDate: new Date(),
    })

    await storeEmbeddingsToPinecone(
      pdf.id,
      userId.toString(),
      chunks,
      embeddings
    )

    res.json({
      success: true,
      data: {
        pdfId: pdf.id,
        message: 'PDF uploaded and processed successfully',
      },
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: 'Error processing PDF' })
  }
})

app.get('/pdfs', async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' })
      return
    }

    const pdfs = await PDF.findAll({
      where: { userId },
      order: [['uploadDate', 'DESC']],
    })

    res.json({
      success: true,
      data: pdfs,
    })
  } catch (error) {
    console.error('Error fetching PDFs:', error)
    res.status(500).json({ message: 'Error fetching PDFs' })
  }
})

const PORT = process.env.PORT || 5000
sequelize
  .sync()
  .then(() => {
    console.log('Database synced')
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err: Error) => {
    console.error('Sequelize sync error:', err)
  })
