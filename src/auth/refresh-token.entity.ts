import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from '../users/user.entity'
import { IRefreshToken } from './interfaces'

@ObjectType()
@Entity('refresh_tokens')
export class RefreshTokenEntity implements IRefreshToken {
  @PrimaryGeneratedColumn('uuid')
  @Field({ nullable: false })
  token: string

  @Column('bigint')
  @Field()
  exp: number

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.token)
  user: UserEntity
}
