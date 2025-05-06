import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import { LocalCustomRequest } from '../types/customRequest'

interface CustomUser {
  id: number
  name?: string
  email?: string
  isPremium: boolean
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: CustomUser
  }
}

interface JwtPayload {
  userId: number
  name: string
  ispremiumuser: boolean
}

export const authenticate = async (
  req: LocalCustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization')
    if (!authHeader) {
      res.status(401).json({ success: false, message: 'Token missing' })
      return
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

    const user = await User.findByPk(decoded.userId)
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' })
      return
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      isPremium: decoded.ispremiumuser,
    }

    next()
  } catch (err) {
    console.error('Auth error:', err)
    res.status(401).json({ success: false, message: 'Authentication failed' })
  }
}
