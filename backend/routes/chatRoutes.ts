import express, { Router } from 'express'
import { askQuestion } from '../controllers/chatController'

const router: Router = express.Router()

router.post('/chat', (req, res) => askQuestion(req, res))

export default router
