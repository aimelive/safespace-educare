import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') ?? 5001;
  const corsOrigin = configService.get<string>('corsOrigin') ?? '*';

  // ── Security ─────────────────────────────────────────────────────────────
  app.use(helmet());

  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // ── Global prefix  (/api/auth, /api/sessions, …) ─────────────────────────
  app.setGlobalPrefix('api');

  // ── Validation ────────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // strip unknown properties
      transform: true,       // auto-transform plain objects to DTO class instances
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Error handling ────────────────────────────────────────────────────────
  // Returns { error: "message" } to stay backward-compatible with the frontend
  app.useGlobalFilters(new HttpExceptionFilter());

  // ── Swagger / OpenAPI ─────────────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SafeSpace Educare API')
    .setDescription(
      'Mental health & educational support platform REST API.\n\n' +
        'Authenticate via the **Authorize** button using a JWT obtained from `POST /api/auth/login`.',
    )
    .setVersion('2.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT',
    )
    .addTag('auth', 'Authentication – register, login, current user')
    .addTag('sessions', 'Counseling sessions – booking & management')
    .addTag('moods', 'Mood tracking – check-ins and history')
    .addTag('resources', 'Mental health resources – browse and save')
    .addTag('posts', 'Community posts – share and like')
    .addTag('victories', 'Personal victories – log and list')
    .addTag('chat', 'Anonymous chat – start sessions and exchange messages')
    .addTag('analytics', 'Analytics dashboard (counselor / admin only)')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // Note: SwaggerModule.setup path is NOT prefixed by setGlobalPrefix.
  // Setting it to 'api/docs' makes it accessible at /api/docs.
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // ── Health check (not prefixed by global prefix) ─────────────────────────
  // Handled by NestJS's global prefix – accessible at GET /health
  // (We re-add it via a simple express handler so it stays at /health, not /api/health)

  await app.listen(port);
  logger.log(`Server listening on http://localhost:${port}`);
  logger.log(`Swagger UI  →  http://localhost:${port}/api/docs`);
  logger.log(`Health      →  http://localhost:${port}/api/health`);
}

bootstrap();
