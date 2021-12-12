import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserEntity } from './user.entity'
import { UserInput } from './user.input'

/**
 * Service to manage users
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  /**
   * Get all users
   */
  async getAllUsers(): Promise<UserEntity[]> {
    return await this.repo.find()
  }

  /**
   * Get user by id
   */
  async getUserById(id: number): Promise<UserEntity> {
    return await this.repo.findOne({ id })
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.repo.findOne({ email })
  }

  /**
   * Get user by unique hash
   */
  async getUserByHash(activateHash: string): Promise<UserEntity> {
    return await this.repo.findOne({ activateHash })
  }

  /**
   * Create user
   */
  async createUser(user: UserInput | Partial<UserEntity>): Promise<UserEntity> {
    return await this.repo.save(user)
  }

  /**
   * Remove user
   */
  async removeUser(id: number): Promise<UserEntity> {
    const _user = await this.repo.findOne({ id })
    await this.repo.remove(_user)
    return _user
  }

  /**
   * Update user
   */
  async updateUser(user: Partial<UserEntity>): Promise<UserEntity> {
    await this.repo.update({ id: user.id }, user)
    return await this.getUserById(user.id)
  }
}
