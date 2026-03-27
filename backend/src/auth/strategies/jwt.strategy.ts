import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../common/types';

/**
 * Validates the JWT Bearer token on every protected request.
 * The validated payload is attached to `request.user` by Passport.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'secret-key',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (!payload?.id) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
