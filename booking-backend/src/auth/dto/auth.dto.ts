import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

// Used for /auth/register
export class RegisterUserDto {
    @IsNotEmpty({ message: 'Name is required' })
    name!: string;

    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email is required' })
    email!: string;

    // The password validation logic mirrors the one you created in AuthService
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
    @IsNotEmpty({ message: 'Password is required' })
    password!: string;
}

// Used for /auth/login
export class LoginUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}

// Used for /auth/refresh
export class RefreshTokenDto {
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken!: string;
}