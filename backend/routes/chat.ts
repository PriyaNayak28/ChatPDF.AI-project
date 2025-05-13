import express, { Router } from 'express'
import { askQuestion } from '../controllers/chat'
import { authenticate } from '../middleware/auth'

const router: Router = express.Router()

router.post('/prompt', authenticate, askQuestion)

export default router
