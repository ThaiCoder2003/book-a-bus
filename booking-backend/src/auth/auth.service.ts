import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

// Định nghĩa lại Payload cho chuẩn xác
export interface AuthPayload {
  userId: string; // Token lưu ID dưới dạng string
  email: string;
  name?: string;
  role: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

const DEFAULT_USER_ROLE = 'user';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // --- HELPER METHODS ---

  private async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  private async comparePassword(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }

  /**
   * Helper tạo cả cặp Token (Access + Refresh)
   */
  private async generateTokens(payload: AuthPayload): Promise<TokenResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '24h' }), // Access Token
      this.jwtService.signAsync(payload, { expiresIn: '7d' }), // Refresh Token
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: '24h',
    };
  }

  /**
   * Helper update Refresh Token Hash vào Database
   */
  private async updateRefreshTokenInDB(userId: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken: hash,
    });
  }

  // --- MAIN FEATURES ---

  public async registerUser(registrationData: {
    email: string;
    password: string;
    name: string;
  }): Promise<any> {
    const { email, password, name } = registrationData;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const isPasswordValid = AuthService.validatePassword(password);
    if (!isPasswordValid.valid) {
      throw new ConflictException(isPasswordValid.message);
    }

    const passwordHash = await this.hashData(password); // Tái sử dụng hàm hashData
    const newUser = this.usersRepository.create({
      email,
      passwordHash,
      name,
      role: DEFAULT_USER_ROLE,
    });

    const savedUser = await this.usersRepository.save(newUser);
    const { passwordHash: _, ...result } = savedUser;
    return result;
  }

  public async loginUser(login: {
    email: string;
    password: string;
  }): Promise<{ user: Omit<User, 'passwordHash'>; token: TokenResponse }> {
    const { email, password } = login;

    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'role', 'passwordHash'], // Explicit select
    });

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await this.comparePassword(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid email or password');

    const payload: AuthPayload = {
      userId: user.id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // 1. Tạo tokens
    const tokens = await this.generateTokens(payload);

    // 2. Lưu hash của Refresh Token vào DB
    await this.updateRefreshTokenInDB(user.id, tokens.refreshToken);

    const { passwordHash: _, ...userWithoutHash } = user;
    return {
      user: userWithoutHash,
      token: tokens,
    };
  }

  public async refreshToken(
    currentRefreshToken: string,
  ): Promise<TokenResponse> {
    try {
      // 1. Verify token chữ ký (nếu hết hạn sẽ throw lỗi ngay tại đây)
      const decoded =
        await this.jwtService.verifyAsync<AuthPayload>(currentRefreshToken);

      if (!decoded || !decoded.userId) {
        throw new UnauthorizedException('Invalid token structure');
      }

      const userId = decoded.userId;

      // 2. Lấy User + Hash Token trong DB
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        select: ['id', 'email', 'name', 'role', 'currentHashedRefreshToken'], // <--- QUAN TRỌNG
      });

      if (!user || !user.currentHashedRefreshToken) {
        throw new ForbiddenException('Access Denied'); // Token bị thu hồi hoặc user ko tồn tại
      }

      // 3. So sánh token gửi lên vs token trong DB
      const isRefreshTokenMatching = await bcrypt.compare(
        currentRefreshToken,
        user.currentHashedRefreshToken,
      );

      if (!isRefreshTokenMatching) {
        throw new ForbiddenException('Invalid Refresh Token');
      }

      // 4. Token Rotation: Tạo cặp token MỚI hoàn toàn
      const newPayload: AuthPayload = {
        userId: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      };

      const newTokens = await this.generateTokens(newPayload);

      // 5. Cập nhật hash MỚI vào DB (token cũ sẽ vô hiệu lực từ đây)
      await this.updateRefreshTokenInDB(user.id, newTokens.refreshToken);

      return newTokens;
    } catch (e) {
      // Bắt lỗi verify jwt hoặc lỗi DB
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  public async logout(userId: string): Promise<void> {
    // Xóa hash token trong DB để chặn refresh
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  // --- UTILS ---
  static extractToken(authHeader: string | null): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      return parts[1];
    }
    return null;
  }

  static validatePassword(password: string): {
    valid: boolean;
    message?: string;
  } {
    if (password.length < 8)
      return {
        valid: false,
        message: 'Password must be at least 8 characters',
      };
    if (!/[A-Z]/.test(password))
      return {
        valid: false,
        message: 'Password must contain uppercase letter',
      };
    if (!/[a-z]/.test(password))
      return {
        valid: false,
        message: 'Password must contain lowercase letter',
      };
    if (!/[0-9]/.test(password))
      return { valid: false, message: 'Password must contain number' };
    return { valid: true };
  }
}
