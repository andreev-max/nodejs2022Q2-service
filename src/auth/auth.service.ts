import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';

import { PrismaService } from 'src/prisma.service';
import { MESSAGES } from 'src/utils/constants';
import { Tokens } from 'src/utils/interfaces';

import { AuthDto } from './dto/auth.dto';

const TOKEN_EXPIRE_TIME = process.env.TOKEN_EXPIRE_TIME ?? '1h';
const TOKEN_REFRESH_EXPIRE_TIME =
  process.env.TOKEN_REFRESH_EXPIRE_TIME ?? '24h';
const JWT_SECRET_REFRESH_KEY = process.env.JWT_SECRET_REFRESH_KEY ?? 'secret';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? 'secret';
const CRYPT_SALT = process.env.CRYPT_SALT ?? '10';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async singup({ password, login }: AuthDto): Promise<Tokens> {
    const hashedPassword = await hash(password, Number(CRYPT_SALT));

    const currentTime = Date.now();

    const newUser = await this.prisma.user.create({
      data: {
        id: v4(),
        login: login,
        password: hashedPassword,
        createdAt: currentTime,
        updatedAt: currentTime,
        version: 1,
      },
    });

    const signedTokens = await this.signTokens(newUser.id, newUser.login);
    await this.updateUserHashedRefreshToken(
      signedTokens.refreshToken,
      newUser.id,
    );
    return signedTokens;
  }

  async login({ login, password }: AuthDto): Promise<Tokens> {
    const foundUser = await this.prisma.user.findFirst({ where: { login } });

    if (!foundUser) {
      throw new ForbiddenException(MESSAGES.ACCESS_DENIED);
    }

    const isPasswordsMatch = await compare(password, foundUser.password);

    if (!isPasswordsMatch) {
      throw new ForbiddenException(MESSAGES.ACCESS_DENIED);
    }

    const signedTokens = await this.signTokens(foundUser.id, foundUser.login);
    await this.updateUserHashedRefreshToken(
      signedTokens.refreshToken,
      foundUser.id,
    );
    return signedTokens;
  }

  async getRefreshTokens(refreshToken: string) {
    try {
      const request = await this.jwtService.verifyAsync(refreshToken, {
        secret: JWT_SECRET_REFRESH_KEY,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: request['userId'] },
      });

      if (!user || !user.hashedRefreshToken) {
        throw new ForbiddenException(MESSAGES.ACCESS_DENIED);
      }

      const isTokensMatch = await compare(
        refreshToken,
        user.hashedRefreshToken,
      );

      if (!isTokensMatch) {
        throw new ForbiddenException(MESSAGES.ACCESS_DENIED);
      }

      const signedTokens = await this.signTokens(user.id, user.login);
      await this.updateUserHashedRefreshToken(
        signedTokens.refreshToken,
        user.id,
      );
      return signedTokens;
    } catch (error) {
      if (error.message === 'invalid signature') {
        throw new ForbiddenException(error.message);
      }

      throw new UnauthorizedException(error.message);
    }
  }

  async signTokens(userId: string, login: string): Promise<Tokens> {
    const [refreshToken, accessToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, login },
        {
          secret: JWT_SECRET_REFRESH_KEY,
          expiresIn: TOKEN_REFRESH_EXPIRE_TIME,
        },
      ),
      this.jwtService.signAsync(
        { userId, login },
        {
          secret: JWT_SECRET_KEY,
          expiresIn: TOKEN_EXPIRE_TIME,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async updateUserHashedRefreshToken(refreshToken: string, userId: string) {
    const hashedRefreshToken = await hash(refreshToken, Number(CRYPT_SALT));

    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }
}
