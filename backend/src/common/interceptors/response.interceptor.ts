import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import type { Observable } from 'rxjs';

/**
 * Passthrough interceptor reserved for future response envelope transformation.
 * Responses are intentionally left unwrapped to maintain frontend compatibility.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle();
  }
}
