import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { User } from '@prisma/client';
import { Role } from '../common/enums/role.enum';
import { UserMapper } from '../users/mappers/user.mapper';
import { UsersService } from '../users/users.service';
import { AuthRepository } from './auth.repository';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt-payload';

@Injectable()
export class AuthService {
  /**
   * Dummy hash compared against when the email does not exist, so login
   * takes the same time for unknown and known users (prevents user
   * enumeration through response timing).
   */
  private readonly dummyPasswordHash: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const saltRounds =
      this.configService.getOrThrow<number>('bcrypt.saltRounds');
    this.dummyPasswordHash = bcrypt.hashSync(
      randomBytes(32).toString('hex'),
      saltRounds,
    );
  }

  async login(dto: LoginDto): Promise<AuthTokensDto> {
    const user = await this.usersService.findByEmailForAuth(dto.email);

    const passwordValid = await bcrypt.compare(
      dto.password,
      user?.passwordHash ?? this.dummyPasswordHash,
    );

    if (!user || !user.isActive || !passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(user);
  }

  async refresh(refreshToken: string): Promise<AuthTokensDto> {
    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.authRepository.findByHash(tokenHash);

    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRevoked = stored.revokedAt !== null;
    const isExpired = stored.expiresAt <= new Date();

    if (isRevoked || isExpired) {
      // A rotated/expired token being presented again is a strong signal
      // of token theft: kill every active session for this user.
      await this.authRepository.revokeAllForUser(stored.userId);
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findEntityById(stored.userId);

    if (!user || !user.isActive) {
      await this.authRepository.revokeById(stored.id);
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.authRepository.revokeById(stored.id);
    return this.issueTokens(user);
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      await this.authRepository.revokeAllForUser(userId);
      return;
    }

    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.authRepository.findValidByHash(tokenHash);

    if (!stored) {
      return;
    }

    if (stored.userId !== userId) {
      throw new ForbiddenException('Refresh token does not belong to user');
    }

    await this.authRepository.revokeById(stored.id);
  }

  private async issueTokens(user: User): Promise<AuthTokensDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as Role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('jwt.accessSecret'),
      expiresIn: this.configService.getOrThrow<number | string>(
        'jwt.accessExpiresIn',
      ) as number | `${number}${'s' | 'm' | 'h' | 'd'}`,
    });

    const refreshToken = this.generateRefreshToken();
    const expiresAt = this.getRefreshExpirationDate();

    await this.authRepository.createRefreshToken({
      tokenHash: this.hashToken(refreshToken),
      userId: user.id,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user: UserMapper.toResponse(user),
    };
  }

  private generateRefreshToken(): string {
    return randomBytes(48).toString('hex');
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private getRefreshExpirationDate(): Date {
    const expiresIn = this.configService.getOrThrow<string>(
      'jwt.refreshExpiresIn',
    );
    const match = /^(\d+)([smhd])$/.exec(expiresIn);

    if (!match) {
      throw new Error(`Invalid JWT_REFRESH_EXPIRES_IN format: ${expiresIn}`);
    }

    const amount = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + amount * multipliers[unit]);
  }
}
