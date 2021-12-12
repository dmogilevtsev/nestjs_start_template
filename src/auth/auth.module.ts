import { Global, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthService } from './services/auth.service'
import { AuthResolver } from './auth.resolver'
import { UserModule } from '../users/user.module'
import { JwtStrategy } from './strategy/jwt.strategy'
import { TokenService } from './services/token.service'
import { RefreshTokenEntity } from './refresh-token.entity'
import { GoogleStrategy } from './strategy/google.strategy'
import { AuthController } from './auth.controller'
import { NodemailerService } from '../nodemailer/nodemailer.service'
import { FacebookStrategy } from './strategy/facebook.strategy'

@Global()
@Module({
  imports: [
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('JWT_ACCESS_EXPIRES_IN'),
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    TokenService,
    NodemailerService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
