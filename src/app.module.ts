import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'

import { NodemailerModule } from './nodemailer/nodemailer.module'
import { DbConfigService } from './config/db-config.service'
import { UserModule } from './users/user.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DbConfigService,
      inject: [DbConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: 'schema.gql',
        sortSchema: true,
        cors: {
          origin: `${configService.get<string>(
            'API_HOST',
          )}${configService.get<string>('API_PORT')}`,
          credentials: true,
        },
        context: ({ req, res }) => ({ req, res }),
        playground: {
          settings: {
            'request.credentials': 'include',
          },
        },
      }),
    }),
    UserModule,
    AuthModule,
    NodemailerModule,
  ],
  providers: [DbConfigService],
})
export class AppModule {}
