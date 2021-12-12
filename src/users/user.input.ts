import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

@InputType()
export class UserInput {
  @Field({ nullable: false })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  @Field({ nullable: true })
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string
}
