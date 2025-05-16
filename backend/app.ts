import express, { Application } from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import session from 'express-session'
import multer from 'multer'
import fs from 'fs'
import pdfParse from 'pdf-parse'
import axios from 'axios'
import dotenv from 'dotenv'
import passport from 'passport'
import userRoutes from './routes/user'
import premiumRoutes from './routes/premium'
import chatRoutes from './routes/chat'
import { embedText } from './util/embedding'
import PDF from './models/pdf'
import { v4 as uuidv4 } from 'uuid'
import { storeEmbeddingsToPinecone } from './services/storeEmbeddings'
import { setupAssociations } from './models/associate'
import { authenticate } from './middleware/auth'
import sequelize from './util/database'
import { storage } from './util/cloudinary'
import User from './models/user'

dotenv.config()
setupAssociations()

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File
      user?: User | undefined
    }
  }
}

const app: Application = express()

app.use(cors({ origin: 'chatpdfapp.netlify.app', credentials: true }))
app.use(bodyParser.json())
app.use(express.json())

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
app.use('/premium', premiumRoutes)
app.use('/groq', chatRoutes)

// const localStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + '-' + file.originalname
//     cb(null, uniqueName)
//   },
// })
const upload = multer({ storage })

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

app.post('/upload', authenticate, upload.single('pdf'), (req, res, next) => {
  ;(async () => {
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
      // const filePath = req.file.path
      const fileUrl = (req.file as any).path
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' })
      const dataBuffer = Buffer.from(response.data as ArrayLike<number>)
      const pdfData = await pdfParse(dataBuffer)
      const extractedText = pdfData.text
      // const dataBuffer = fs.readFileSync(filePath)
      // const pdfData = await pdfParse(dataBuffer)
      // const extractedText = pdfData.text

      const chunks = chunkText(extractedText, 1000, 100)
      const embeddings = await Promise.all(
        chunks.map((chunk) => embedText(chunk))
      )

      const pdf = await PDF.create({
        id: uuidv4(),
        userId: userId,
        storedFilename: req.file.filename,
        originalFilename: req.file.originalname,
        filePath: fileUrl,
        uploadDate: new Date(),
      })

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
  })().catch(next)
})

app.get('/pdfs', authenticate, (req, res, next) => {
  ;(async () => {
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
  })().catch(next)
})

app.get('/pdf/:id', authenticate, (req, res) => {
  const { id } = req.params
  PDF.findByPk(id)
    .then((pdf) => {
      if (!pdf) {
        return res.status(404).send('PDF not found')
      }
      res.json({
        success: true,
        data: {
          url: pdf.filePath,
        },
      })
    })
    .catch((error) => {
      console.error('Error fetching PDF:', error)
      res.status(500).json({ message: 'Error fetching PDF' })
    })
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
