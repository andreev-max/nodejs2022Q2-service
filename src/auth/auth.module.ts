import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma.service';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    PrismaService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
