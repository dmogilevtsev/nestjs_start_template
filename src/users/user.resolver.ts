import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { UserEntity } from './user.entity'
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard'
import { UserService } from './user.service'
import { UserInput } from './user.input'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'

@UseGuards(GqlAuthGuard)
@Resolver('Users')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserEntity)
  async createUser(@Args('user') user: UserInput): Promise<UserEntity> {
    return await this.userService.createUser(user)
  }

  @Query(() => [UserEntity])
  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userService.getAllUsers()
  }

  @Query(() => UserEntity)
  async whoAmI(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return await this.userService.getUserByEmail(user.email)
  }

  @Mutation(() => UserEntity)
  async removeUser(@Args('id') id: number): Promise<UserEntity> {
    return await this.userService.removeUser(id)
  }
}
