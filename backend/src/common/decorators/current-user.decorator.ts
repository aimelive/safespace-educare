import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types';

/**
 * Injects the currently authenticated user (or a single field) into a route handler.
 *
 * @example
 *   getMe(@CurrentUser() user: JwtPayload) { … }
 *   getMe(@CurrentUser('id') userId: string) { … }
 */
export const CurrentUser = createParamDecorator(
  (
    data: keyof JwtPayload | undefined,
    ctx: ExecutionContext,
  ): JwtPayload | JwtPayload[keyof JwtPayload] => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
    const user = request.user;
    return data ? user[data] : user;
  },
);
