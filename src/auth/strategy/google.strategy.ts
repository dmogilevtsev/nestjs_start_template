import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { ConfigService } from '@nestjs/config'

import { IPayload, SOCIAL_NETWORKS } from '../interfaces'
import { UserEntity } from '../../users/user.entity'
import { UserService } from '../../users/user.service'
import { AuthService } from '../services/auth.service'
import { IUser } from '../../users/user.interface'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_SECRET_KEY'),
      callbackURL: configService.get<string>('GOOGLE_URI_REDIRECT'),
      scope: ['email', 'profile'],
    })
  }

  async validate(
    googleAccessToken: string,
    googleRefreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
    }
    const payload: IPayload = { email: '', userId: 0 }
    const candidate = await this.userService.getUserByEmail(user.email)
    if (!candidate) {
      const _user = new UserEntity()
      _user.email = user.email
      _user.createdBy = SOCIAL_NETWORKS.GOOGLE
      _user.firstName = user.firstName
      _user.lastName = user.lastName
      _user.photo = user.picture
      const newUser = await this.userService.createUser(_user)
      payload.userId = newUser.id
      payload.email = newUser.email
    } else {
      payload.userId = candidate.id
      payload.email = candidate.email
    }
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      payload,
    )
    const resUser: IUser = await this.userService.getUserById(payload.userId)
    delete resUser.password
    done(null, {
      user: resUser,
      accessToken,
      refreshToken,
    })
  }
}
