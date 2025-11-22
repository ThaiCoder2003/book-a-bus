import jwt from "jsonwebtoken";
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // <--- TypeORM Import
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

type UserWithoutHash = Omit<User, 'passwordHash'>;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRATION = "24h";
const BCRYPT_ROUNDS = 10;
const DEFAULT_USER_ROLE = 'user';

export interface AuthPayload {
  userId: string;
  email: string;
  name?: String;
  role: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  
  /**
   * Hash a password using bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }
  /**
   * Compare password with hash
   */
  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT access token
   */
  private generateAccessToken(payload: AuthPayload): TokenResponse {
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    return {
      accessToken,
      expiresIn: JWT_EXPIRATION,
    };
  }

  /**
   * Generate refresh token (longer expiration)
   */
  private generateRefreshToken(payload: AuthPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
    });
  }


  /**
   * Verify and decode JWT token
   */
  private verifyToken(token: string): AuthPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Decode token without verification (for reading claims)
   */
  private decodeToken(token: string): AuthPayload | null {
    try {
      const decoded = jwt.decode(token) as AuthPayload | null;
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Extract Bearer token from Authorization header
   */
  static extractToken(authHeader: string | null): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
      return parts[1];
    }
    return null;
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return { valid: false, message: "Password must be at least 8 characters" };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: "Password must contain uppercase letter" };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: "Password must contain lowercase letter" };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: "Password must contain number" };
    }

    return { valid: true };
  }

  public async registerUser(registrationData: { email: string, password: string, name: string }): Promise<any> {
    const { email, password, name } = registrationData;
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const isPasswordValid = AuthService.validatePassword(password);
    if (!isPasswordValid.valid) {
      throw new ConflictException(isPasswordValid.message);
    }

    const passwordHash = await this.hashPassword(password);
    const newUser = this.usersRepository.create({
       email, 
       passwordHash, 
       name, 
       role: DEFAULT_USER_ROLE 
    });
    const savedUser = await this.usersRepository.save(newUser);
    const { passwordHash: _, ...result } = savedUser;
    return result;
  }

public async loginUser(login: { email: string, password: string }): Promise<{ user: UserWithoutHash, token: TokenResponse }> {
    const { email, password } = login;
    
    // TypeORM: findOne with 'where' clause
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const jwtPayload: AuthPayload = {
      userId: user.id.toString(), // <--- Use 'id' for TypeORM/Postgres PK
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = this.generateAccessToken(jwtPayload);
    const refreshToken = this.generateRefreshToken(jwtPayload);

    token.refreshToken = refreshToken;

    const { passwordHash: _, ...userWithoutHash } = user;

    return {
      user: userWithoutHash,
      token: token,
    }
  }

public async refreshToken(currentRefreshToken: string): Promise<TokenResponse> {
    const decoded = this.verifyToken(currentRefreshToken);
    
    if (!decoded || !decoded.userId) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
    
    // TypeORM: findOneBy with 'id'
    const user = await this.usersRepository.findOneBy({ id: decoded.userId }); 

    if (!user) {
      throw new UnauthorizedException('User no longer exists.');
    }
    
    // Build new payload using the latest data from the database
    const newPayload: AuthPayload = {
      userId: user.id.toString(), // <--- Use 'id'
      email: user.email,
      name: user.name,
      role: user.role
    };

    return this.generateAccessToken(newPayload);
  }
}

