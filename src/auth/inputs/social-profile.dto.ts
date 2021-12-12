import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SocialProfileDto {
  @Field({ nullable: true }) user?: any
}
