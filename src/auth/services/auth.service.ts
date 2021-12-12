import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { v4 as uuid } from 'uuid'

import { UserService } from '../../users/user.service'
import { AuthHelper } from '../auth.helper'
import { UserEntity } from '../../users/user.entity'
import { IPayload } from '../interfaces'
import { TokensInput } from '../inputs/tokens.input'
import { UserInput } from '../../users/user.input'
import { TokenService } from './token.service'
import { SocialProfileDto } from '../inputs/social-profile.dto'
import {
  IMailMessage,
  NodemailerService,
} from '../../nodemailer/nodemailer.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly nodemailerService: NodemailerService,
  ) {}

  async login(userInput: UserInput): Promise<TokensInput> {
    const user = await this.validateUser(userInput)
    if (!user) {
      throw new HttpException('No valid credentials', HttpStatus.UNAUTHORIZED)
    }
    if (!user.isActivated) {
      throw new HttpException(
        'Your account not activated',
        HttpStatus.UNAUTHORIZED,
      )
    }
    const payload: IPayload = { email: user.email, userId: user.id }
    return await this.generateTokens(payload)
  }

  async register({ email, password }: UserInput): Promise<UserEntity> {
    const user = await this.userService.getUserByEmail(email)
    if (user) {
      throw new HttpException(
        `User with ${email} already exist`,
        HttpStatus.CONFLICT,
      )
    }
    const hashedPassword = await AuthHelper.hash(password)
    const hash = uuid()
    const link = `${this.configService.get<string>(
      'API_HOST',
    )}${this.configService.get<string>('API_PORT')}/activate/${hash}`
    const message: IMailMessage = {
      to: email,
      subject: 'Activate your account',
      html: `
        Hi!<br/><br/>
        Please click <a href="${link}">Activation</a> to activate your account
        <br/><br/>
        Regards, development team
    `,
    }
    await this.nodemailerService.sendMessage(message)
    return await this.userService.createUser({
      email,
      password: hashedPassword,
      activateHash: hash,
    })
  }

  async validateUser(
    userInput: UserInput,
  ): Promise<Partial<UserEntity>> | null {
    const user = await this.userService.getUserByEmail(userInput.email)
    if (user) {
      const isMatch = await AuthHelper.compare(
        userInput.password,
        user.password,
      )
      if (!isMatch) {
        throw new HttpException('No valid password', HttpStatus.UNAUTHORIZED)
      }
      delete user.password
      return user
    }
    return null
  }

  async generateTokens(payload: IPayload): Promise<TokensInput> {
    const accessToken = {
      token: 'Bearer ' + this.jwtService.sign(payload),
      exp: new Date(
        Date.now() +
          parseInt(this.configService.get<string>('JWT_ACCESS_EXPIRES_IN')),
      ).valueOf(),
    }
    const user = await this.userService.getUserById(payload.userId)
    const refreshToken = await this.tokenService.createToken(user)
    delete user.password
    return {
      user,
      accessToken,
      refreshToken: {
        token: refreshToken.token,
        exp: refreshToken.exp,
      },
    }
  }

  async updateToken(refreshToken: string): Promise<TokensInput> | null {
    const _refreshToken = await this.tokenService.getToken(refreshToken)
    if (_refreshToken) {
      return await this.generateTokens({
        email: _refreshToken.user.email,
        userId: _refreshToken.user.id,
      })
    }
    return null
  }

  async socialLogin(req): Promise<SocialProfileDto> {
    if (!req.user) {
      return { user: 'No user from this service' }
    }

    return {
      user: req.user,
    }
  }

  async activate(hash: string): Promise<TokensInput> {
    const _user = await this.userService.getUserByHash(hash)
    if (!_user) {
      throw new HttpException(
        'Activation link not valid',
        HttpStatus.BAD_REQUEST,
      )
    }
    await this.userService.updateUser({
      id: _user.id,
      activateHash: null,
      isActivated: true,
    })
    return await this.generateTokens({ email: _user.email, userId: _user.id })
  }
}
