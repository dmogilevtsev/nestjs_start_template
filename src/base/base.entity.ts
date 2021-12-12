import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType({ isAbstract: true })
export abstract class BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field({ nullable: false })
  @CreateDateColumn()
  createdAt: Date

  @Field({ nullable: false })
  @UpdateDateColumn()
  updatedAt: Date
}
