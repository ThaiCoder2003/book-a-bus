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
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'nestjs_auth'),
        
        // List the entities (tables) TypeORM should manage
        entities: [User], 
        
        // IMPORTANT: In production, never set synchronize: true
        // It should be false, and you should use Migrations instead.
        synchronize: true, // Auto-create tables based on entities (dev only)
      }),
    }),
    
    // 3. Import your main feature module
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}