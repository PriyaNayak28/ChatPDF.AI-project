import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

interface JwtPayload {
  userId: number
  name: string
  ispremiumuser: boolean
}

interface AuthenticatedRequest extends Request {
  user?: User
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')
    if (!token) {
      res.status(401).json({ success: false, message: 'Token missing' })
      return
    }

    const decoded = jwt.verify(token, '#@focus28ABCDabcd') as JwtPayload

    const user = await User.findByPk(decoded.userId)
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' })
      return
    }

    req.user = user
    next()
  } catch (err) {
    console.error('Auth error:', err)
    res.status(401).json({ success: false, message: 'Authentication failed' })
  }
}
