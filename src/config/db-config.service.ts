import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

@Injectable()
export class DbConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: this.configService.get<'aurora-data-api'>('TYPEORM_CONNECTION'),
      username: this.configService.get<string>('TYPEORM_USERNAME'),
      password: this.configService.get<string>('TYPEORM_PASSWORD'),
      database: this.configService.get<string>('TYPEORM_DATABASE'),
      port: +this.configService.get<number>('TYPEORM_PORT'),
      host: this.configService.get<string>('TYPEORM_HOST'),
      entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
      migrationsTableName: this.configService.get<string>(
        'TYPEORM_MIGRATIONS_TABLE_NAME',
      ),
      migrations: ['dist/migration/*{.js,.ts}'],
      cli: {
        migrationsDir: this.configService.get<string>('TYPEORM_MIGRATIONS_DIR'),
      },
      synchronize:
        this.configService.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
      migrationsRun:
        this.configService.get<string>('TYPEORM_MIGRATIONS_RUN') === 'true',
      autoLoadEntities: true,
      dropSchema: false,
      logging: this.configService.get<string>('TYPEORM_LOGGING') === 'true',
    }
  }
}
