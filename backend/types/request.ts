// export interface AuthenticatedUser {
//   id: number
//   name: string
//   email: string
//   isPremium: boolean
// }

export interface AuthenticatedUser extends Request {
  user: {
    id: number
    name: string
    email: string
    isPremium: boolean
  }
}
