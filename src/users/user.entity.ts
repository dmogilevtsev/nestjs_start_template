import { Column, Entity, OneToMany } from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'

import { BaseEntity } from '../base/base.entity'
import { RefreshTokenEntity } from '../auth/refresh-token.entity'
import { SOCIAL_NETWORKS } from '../auth/interfaces'
import { IUser, ROLE, SEX } from './user.interface'

/**
 * User entity
 */
@ObjectType()
@Entity('users')
export class UserEntity extends BaseEntity implements IUser {
  /**
   * User's email
   */
  @Field({ nullable: false })
  @Column({ nullable: false })
  email: string

  /**
   * User's password
   */
  @Field({ nullable: true })
  @Column({ nullable: true })
  password?: string

  /**
   * User's phone
   */
  @Field({ nullable: true })
  @Column({ nullable: true })
  phone: string

  /**
   * User's activation sign
   */
  @Field({ defaultValue: false })
  @Column({ default: false })
  isActivated: boolean

  /**
   * Activation hash string
   */
  @Field({ nullable: true })
  @Column({ nullable: true })
  activateHash: string

  /**
   * User's first name
   */
  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName: string

  /**
   * User's last name
   */
  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName: string

  /**
   * User's photo
   */
  @Field({ nullable: true })
  @Column({ nullable: true })
  photo: string

  /**
   * Authentication source
   */
  @Field({ nullable: true, defaultValue: SOCIAL_NETWORKS.DEFAULT })
  @Column('enum', {
    nullable: true,
    name: 'created_by',
    enum: SOCIAL_NETWORKS,
    default: SOCIAL_NETWORKS.DEFAULT,
  })
  createdBy: SOCIAL_NETWORKS

  /**
   * User gender
   * @default not chosen
   */
  @Field({ nullable: true, defaultValue: SEX.NOT_CHOSEN })
  @Column('enum', {
    nullable: true,
    name: 'sex',
    enum: SEX,
    default: SEX.NOT_CHOSEN,
  })
  sex: SEX

  /**
   * refresh token - to check and generate a new pair of tokens
   */
  @Field(() => [RefreshTokenEntity], { nullable: true })
  @OneToMany(() => RefreshTokenEntity, (token) => token.token)
  token: RefreshTokenEntity[]

  /**
   * User's role
   * @default student
   */
  @Field({ nullable: false })
  @Column('enum', {
    nullable: false,
    default: ROLE.STUDENT,
    enum: ROLE,
  })
  role: ROLE
}
