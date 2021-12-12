import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { RefreshTokenEntity } from '../refresh-token.entity'
import { UserEntity } from '../../users/user.entity'

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repo: Repository<RefreshTokenEntity>,
  ) {}

  async createToken(user: UserEntity): Promise<RefreshTokenEntity> {
    const _token = (await this.repo.findOne({ user })) || null
    if (_token) {
      await this.repo.remove(_token)
    }
    const token = new RefreshTokenEntity()
    token.user = user
    token.exp = new Date().setMonth(new Date().getMonth() + 2) // +2 мес
    return await this.repo.save(token)
  }

  async getToken(refreshToken: string): Promise<RefreshTokenEntity> | null {
    const _token = await this.repo.findOne(
      { token: refreshToken },
      { relations: ['user'] },
    )
    if (new Date(_token.exp) < new Date()) {
      return null
    }
    return _token
  }
}
