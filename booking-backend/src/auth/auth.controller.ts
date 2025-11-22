import { Controller, Post, Body, Res, HttpStatus, HttpCode, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService, AuthPayload, TokenResponse } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt.guard';
import type { Response, Request as ExpressRequest } from 'express';
import { LoginUserDto, RegisterUserDto, RefreshTokenDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginData: LoginUserDto): Promise<any> {
    return this.authService.loginUser(loginData);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerData: RegisterUserDto): Promise<any> {
    return this.authService.registerUser(registerData);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenData: RefreshTokenDto): Promise<any> {
    return this.authService.refreshToken(refreshTokenData.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req: ExpressRequest): Promise<any> {
    return { 
      message: 'This is a protected route', 
      email: req.body.user,
      name: req.body.name,
      role: req.body.role,
      birthday: req.body.birthday,
      phoneNumber: req.body.phoneNumber
    };
  }
}