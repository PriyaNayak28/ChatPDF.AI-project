import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import { UserInstance } from '../types/user'
import { LocalCustomRequest } from '../types/customRequest'

const isStringInvalid = (input: string | undefined): boolean => {
  return !input || input.length === 0
}

const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body

    if (
      isStringInvalid(name) ||
      isStringInvalid(email) ||
      isStringInvalid(password)
    ) {
      res.status(400).json({ err: 'Bad parameters. Something is missing' })
      return
    }

    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)

    await User.create({ name, email, password: hash })

    res.status(201).json({ message: 'Successfully created new user' })
  } catch (err) {
    res.status(403).json({ error: err })
  }
}

const generateAccessToken = async (
  id: number,
  name: string,
  ispremiumuser: boolean
): Promise<string> => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  return jwt.sign(
    { userId: id, name, ispremiumuser: user.isPremium },
    process.env.JWT_SECRET || '#@focus28ABCDabcd'
  );
}

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (isStringInvalid(email) || isStringInvalid(password)) {
      res
        .status(400)
        .json({ message: 'Email or Password is missing', success: false })
      return
    }

    const users = (await User.findAll({ where: { email } })) as UserInstance[]

    if (users.length > 0) {
      const user = users[0]
      const isMatch = await bcrypt.compare(password, user.password)

      if (isMatch) {
        const token = await generateAccessToken(user.id, user.name, user.isPremium)
        res.status(200).json({
          success: true,
          message: 'User Logged in successfully',
          token,
        })
      } else {
        res
          .status(400)
          .json({ success: false, message: 'Password is incorrect' })
      }
    } else {
      res.status(404).json({ success: false, message: 'User does not exist' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', success: false })
  }
}

const getUserProfile = async (
  req: LocalCustomRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    res.json({ name: user.name, isPremium: user.isPremium })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export { signup, login, generateAccessToken, getUserProfile }
