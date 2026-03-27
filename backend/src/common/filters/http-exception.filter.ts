import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

/**
 * Global exception filter that normalises ALL errors to the legacy shape:
 *   { "error": "human-readable message" }
 *
 * This keeps the frontend payload 100% backward-compatible with the old
 * Express backend which always returned { error: "…" }.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();

      if (typeof body === 'string') {
        message = body;
      } else if (typeof body === 'object' && body !== null) {
        const bodyObj = body as Record<string, unknown>;
        // class-validator sends an array of messages
        if (Array.isArray(bodyObj['message'])) {
          message = (bodyObj['message'] as string[]).join('; ');
        } else if (typeof bodyObj['message'] === 'string') {
          message = bodyObj['message'];
        } else if (typeof bodyObj['error'] === 'string') {
          message = bodyObj['error'];
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `Unhandled exception [${request.method} ${request.url}]: ${exception.message}`,
        exception.stack,
      );
    }

    response.status(status).json({ error: message });
  }
}
