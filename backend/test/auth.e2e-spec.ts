/**
 * Auth E2E Tests
 *
 * These tests spin up the full NestJS application and exercise the
 * /api/auth/* endpoints against a real (or test) PostgreSQL database.
 *
 * Prerequisites:
 *  - .env (or test environment) must have DATABASE_URL and JWT_SECRET set.
 *  - Run with: npm run test:e2e
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('Auth endpoints (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  const uniqueEmail = `e2e_${Date.now()}@test.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ── Register ─────────────────────────────────────────────────────────────

  describe('POST /api/auth/register', () => {
    it('201 – creates a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: uniqueEmail, password: 'testPass123', name: 'E2E User' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toMatchObject({ email: uniqueEmail, role: 'student' });
    });

    it('409 – duplicate email', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: uniqueEmail, password: 'testPass123', name: 'Dup' });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('error');
    });

    it('400 – missing required fields', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'bad-not-email' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ── Login ─────────────────────────────────────────────────────────────────

  describe('POST /api/auth/login', () => {
    it('200 – valid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: uniqueEmail, password: 'testPass123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      authToken = res.body.token as string;
    });

    it('401 – wrong password', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: uniqueEmail, password: 'wrongPass' });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('401 – unknown email', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'nobody@test.com', password: 'anyPass' });

      expect(res.status).toBe(401);
    });
  });

  // ── Me ────────────────────────────────────────────────────────────────────

  describe('GET /api/auth/me', () => {
    it('200 – returns profile with valid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ email: uniqueEmail });
      expect(res.body).not.toHaveProperty('password');
    });

    it('401 – no token', async () => {
      const res = await request(app.getHttpServer()).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('401 – invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', 'Bearer not.a.real.token');
      expect(res.status).toBe(401);
    });
  });
});
