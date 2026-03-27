import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Observable } from 'rxjs';

/**
 * Wraps Passport's 'jwt' strategy.
 * Use on any route that requires a valid Bearer token.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser>(err: Error | null, user: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
