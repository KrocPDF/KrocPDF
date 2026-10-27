import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Verify Cloudflare Turnstile token to protect against bots and abuse
   */
  async verifyTurnstile(token?: string, remoteIp?: string): Promise<boolean> {
    const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    // If not configured in environment, allow through gracefully (failsafe for local dev)
    if (!secretKey || !token) {
      return true;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('secret', secretKey);
      formData.append('response', token);
      if (remoteIp) {
        formData.append('remoteip', remoteIp);
      }

      const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const outcome = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
      return outcome.success === true;
    } catch (err) {
      this.logger.warn(`Failed to verify Cloudflare Turnstile token: ${err}`);
      return true; // Fail open to avoid blocking genuine users on network blips
    }
  }

  private hashPassword(password: string, salt = 'krocpdf_secure_salt'): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  }

  async register(dto: RegisterDto, clientIp?: string) {
    const isHuman = await this.verifyTurnstile(dto.turnstileToken, clientIp);
    if (!isHuman) {
      throw new BadRequestException('Cloudflare Turnstile verification failed. Please try again.');
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new BadRequestException('An account with this email already exists.');
    }

    const passwordHash = this.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        name: dto.name?.trim() || null,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return {
      message: 'Account created successfully',
      user,
    };
  }

  async login(dto: LoginDto, clientIp?: string) {
    const isHuman = await this.verifyTurnstile(dto.turnstileToken, clientIp);
    if (!isHuman) {
      throw new BadRequestException('Cloudflare Turnstile verification failed. Please try again.');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const expectedHash = this.hashPassword(dto.password);
    if (user.passwordHash !== expectedHash) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    };
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { jobs: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return user;
  }
}
