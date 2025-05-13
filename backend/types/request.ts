export interface AuthenticatedUser extends Request {
  user: {
    id: number
    name: string
    email: string
    isPremium: boolean
  }
}
