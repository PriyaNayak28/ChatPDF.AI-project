import Razorpay from 'razorpay'
import { Request, Response } from 'express'
import Order from '../models/order'
import User from '../models/user'
import * as userController from './user'
import { LocalCustomRequest } from '../types/customRequest'

const purchasepremium = async (
  req: LocalCustomRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized user' })
      return
    }

    const userId = req.user.id
    console.log('User ID:', userId)

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const amount = 25000

    rzp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
      if (err) {
        console.error('Razorpay error:', err)
        res.status(500).json({ message: 'Failed to create order' })
        return
      }

      try {
        if (!order || !order.id) {
          throw new Error('Order not created')
        }

        await Order.create({
          orderid: order.id,
          status: 'PENDING',
        })

        res.status(201).json({ order, key_id: process.env.RAZORPAY_KEY_ID })
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to save order', error })
      }
    })
  } catch (err) {
    console.error(err)
    res.status(403).json({ message: 'Something went wrong', error: err })
  }
}

const updateTransactionStatus = async (
  req: LocalCustomRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized user' })
      return
    }

    const userId = req.user.id
    const { payment_id, order_id }: { payment_id: string; order_id: string } =
      req.body

    const order = await Order.findOne({ where: { orderid: order_id } })

    if (!order) {
      res.status(404).json({ message: 'Order not found' })
      return
    }

    const userFromDb = await User.findByPk(userId)

    if (!userFromDb) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    await Promise.all([
      order.update({
        paymentid: payment_id,
        status: 'SUCCESSFUL',
      }),
      userFromDb.update({ isPremium: true }),
    ])

    const token = userController.generateAccessToken(
      userId,
      userFromDb.name || 'Guest',
      true
    )

    res.status(202).json({
      success: true,
      message: 'Transaction Successful',
      token,
    })
  } catch (err) {
    console.error('Error updating transaction status:', err)
    res.status(500).json({ message: 'Something went wrong', error: err })
  }
}

export default {
  purchasepremium,
  updateTransactionStatus,
}
