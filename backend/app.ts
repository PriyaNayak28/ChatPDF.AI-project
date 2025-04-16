import express, { Application } from 'express'
import path from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

dotenv.config()

const app: Application = express()

// Middlewares
app.use(cors())
app.use(bodyParser.json())

// Sequelize instance
import sequelize from './util/database'

// Models
import User from './models/User'

// Routes
import userRoutes from './routes/user'

// Static files
app.use(express.static(path.join(__dirname, 'views')))

// Route handlers
app.use('/user', userRoutes)

const PORT = process.env.PORT || 3000

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
