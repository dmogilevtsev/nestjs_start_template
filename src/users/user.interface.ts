import { IRefreshToken, SOCIAL_NETWORKS } from '../auth/interfaces'

export interface IUser {
  id?: number
  email: string
  password?: string
  phone?: string
  isActivated?: boolean
  activateHash?: string
  firstName?: string
  lastName?: string
  photo?: string
  createdBy?: SOCIAL_NETWORKS
  sex?: SEX
  token?: IRefreshToken[]
  role?: ROLE
}

export enum ROLE {
  STUDENT = 'student',
  POINT_GIVER = 'point giver',
  PRICE_GIVER = 'price giver',
}

export enum SEX {
  MALE = 'male',
  FEMALE = 'female',
  NOT_CHOSEN = 'not chosen',
}
