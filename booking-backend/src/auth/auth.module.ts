import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Use TypeOrmModule
import { PassportModule } from '@nestjs/passport'; // 2. Add PassportModule
import { JwtModule } from '@nestjs/jwt'; // 3. Add JwtModule
import { ConfigModule, ConfigService } from '@nestjs/config'; // Used for fetching JWT_SECRET

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    // 1. Register the User Entity with TypeORM
    TypeOrmModule.forFeature([User]),

    // 2. Configure Passport to use JWT as the default strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // 3. Configure the JWT signing module
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Use the secret from your environment configuration
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        // Set a default sign option (the service uses 24h, but we set a fallback here)
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, PassportModule, JwtModule], // Export modules needed by Guards/Strategies
})
export class AuthModule {}