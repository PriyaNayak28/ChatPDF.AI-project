import express, { Application } from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import session from 'express-session'
import dotenv from 'dotenv'
import passport from 'passport'
import userRoutes from './routes/user'
import premiumRoutes from './routes/premium'
import pdfRoutes from './routes/pdf'
import chatRoutes from './routes/chat'
import { setupAssociations } from './models/associate'
import sequelize from './util/database'

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

app.use(cors({ origin: 'chatwithpdfai.netlify.app', credentials: true }))
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
app.use(pdfRoutes)

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
