import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { Redis } from 'ioredis';
import { User } from '@prisma/client';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL);

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly REFRESH_SECRET = process.env.REFRESH_SECRET!;

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    return this.generateTokens(user.id);
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Usuário não encontrado');

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error('Senha inválida');

    return this.generateTokens(user.id);
  }

  async enable2FA(userId: string) {
    const secret = speakeasy.generateSecret();
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32,
        twoFactorEnabled: true,
      },
    });

    return {
      secret: secret.base32,
      qrCode: secret.otpauth_url,
    };
  }

  async verify2FA(userId: string, token: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true },
    });

    if (!user?.twoFactorSecret) {
      throw new Error('2FA não está habilitado');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (!isValid) {
      throw new Error('Token 2FA inválido');
    }

    return true;
  }

  private async generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, this.JWT_SECRET, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ userId }, this.REFRESH_SECRET, {
      expiresIn: '7d',
    });

    // Armazenar refresh token no Redis
    await redis.set(`refresh:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, this.REFRESH_SECRET) as { userId: string };
      
      // Verificar se o token está no Redis
      const storedToken = await redis.get(`refresh:${decoded.userId}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new Error('Token inválido');
      }

      return this.generateTokens(decoded.userId);
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  async logout(userId: string) {
    await redis.del(`refresh:${userId}`);
  }
}
