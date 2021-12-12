import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-facebook'
import { ConfigService } from '@nestjs/config'
import { VerifyCallback } from 'passport-google-oauth20'
import { IPayload, SOCIAL_NETWORKS } from '../interfaces'
import { UserEntity } from '../../users/user.entity'
import { IUser } from '../../users/user.interface'
import { UserService } from '../../users/user.service'
import { AuthService } from '../services/auth.service'

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_ID'),
      clientSecret: configService.get<string>('FACEBOOK_KEY'),
      callbackURL: configService.get<string>('FACEBOOK_URI_REDIRECT'),
      scope: 'email',
      profileFields: ['name', 'emails', 'photos'],
    })
  }

  async validate(
    fbAccessToken: string,
    fbRefreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { name, emails, photos } = profile
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      photo: photos[0].value,
    }
    const payload: IPayload = { email: '', userId: 0 }
    const candidate = await this.userService.getUserByEmail(user.email)
    if (!candidate) {
      const _user = new UserEntity()
      _user.email = user.email
      _user.createdBy = SOCIAL_NETWORKS.FACEBOOK
      _user.firstName = user.firstName
      _user.lastName = user.lastName
      _user.photo = user.photo
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
