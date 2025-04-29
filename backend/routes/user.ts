import express from 'express'
import { signup, login, getUserProfile } from '../controllers/user'
import { authenticate } from '../middleware/auth'
const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/profile', authenticate, getUserProfile)

export default router
