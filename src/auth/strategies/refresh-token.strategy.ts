import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import 'dotenv/config';

import { JwtPayload, JwtPayloadWithRefreshToken } from 'src/utils/interfaces';
import { MESSAGES } from 'src/utils/constants';

const JWT_SECRET_REFRESH_KEY = process.env.JWT_SECRET_REFRESH_KEY ?? 'secret';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET_REFRESH_KEY,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!refreshToken)
      throw new ForbiddenException(MESSAGES.REFRESH_TOKEN_INCORRECT);

    return { ...payload, refreshToken };
  }
}
