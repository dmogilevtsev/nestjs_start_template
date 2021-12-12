import { Field, ObjectType } from '@nestjs/graphql'
import { UserEntity } from '../../users/user.entity'

@ObjectType()
export class Token {
  @Field() token: string
  @Field() exp: number
}

@ObjectType()
export class User extends UserEntity {}

@ObjectType()
export class TokensInput {
  @Field() user: User
  @Field() accessToken: Token
  @Field() refreshToken: Token
}
