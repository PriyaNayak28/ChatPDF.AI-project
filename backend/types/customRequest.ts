import { Request } from 'express'

export interface CustomUser {
  id: number
  name?: string
  email?: string
  isPremium: boolean
  createOrder?: (order: { orderid: string; status: string }) => Promise<any>
  update?: (fields: Partial<CustomUser>) => Promise<any>
}

export interface LocalCustomRequest extends Request {
  user?: CustomUser
}
