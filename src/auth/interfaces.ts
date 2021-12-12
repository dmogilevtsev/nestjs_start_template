import { IUser } from '../users/user.interface'

export interface IPayload {
  email: string
  userId: number
}

export interface IRefreshToken {
  token: string
  exp: number
  user: IUser
}

export enum SOCIAL_NETWORKS {
  GOOGLE = 'Google',
  FACEBOOK = 'Facebook',
  DEFAULT = 'Email',
}
