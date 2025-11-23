import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    // 1. Load environment variables from .env file globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Configure the TypeORM connection to PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),

        entities: [User],
        synchronize: true, // Dev only

        // cần giữ cái này cho Neon/Cloud DB
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),

    // 3. Import your main feature module
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
