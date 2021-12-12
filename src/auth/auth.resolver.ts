import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ConfigService } from '@nestjs/config'

import { AuthService } from './services/auth.service'
import { Token, TokensInput } from './inputs/tokens.input'
import { UserEntity } from '../users/user.entity'
import { UserInput } from '../users/user.input'

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Mutation(() => TokensInput)
  async login(
    @Args('user') user: UserInput,
    @Context() context,
  ): Promise<TokensInput> {
    const tokens = await this.auth.login(user)
    context.res.cookie('refreshtoken', tokens.refreshToken, {
      httpOnly: true,
      age: this.config.get<string>('JWT_REFRESH_EXPIRES_IN'),
    })
    return tokens
  }

  @Mutation(() => UserEntity)
  async register(@Args('user') user: UserInput): Promise<UserEntity> {
    return await this.auth.register(user)
  }

  @Query(() => TokensInput)
  async updateToken(@Context() context): Promise<TokensInput> | null {
    const refreshToken: Token = context.req.cookies['refreshtoken']
    if (!refreshToken || new Date() > new Date(refreshToken.exp)) {
      return null
    }
    return await this.auth.updateToken(refreshToken.token)
  }
}
