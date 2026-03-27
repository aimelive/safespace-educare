import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { DatabaseService } from '../database/database.service';

// Minimal mock for DatabaseService
const mockDb = {
  query: jest.fn(),
};

const mockJwt = {
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DatabaseService, useValue: mockDb },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // ── register ───────────────────────────────────────────────────────────────

  describe('register', () => {
    it('happy path: creates user and returns token', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [] }) // no existing user
        .mockResolvedValueOnce({
          rows: [{ id: 'u1', email: 'a@b.com', name: 'Alice', role: 'student' }],
        }); // INSERT RETURNING

      const result = await service.register({
        email: 'a@b.com',
        password: 'pass1234',
        name: 'Alice',
      });

      expect(result.token).toBe('mock.jwt.token');
      expect(result.user.email).toBe('a@b.com');
      expect(mockDb.query).toHaveBeenCalledTimes(2);
    });

    it('throws ConflictException when email already exists', async () => {
      mockDb.query.mockResolvedValueOnce({ rows: [{ id: 'existing' }] });

      await expect(
        service.register({ email: 'dup@b.com', password: 'pass', name: 'X' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ── login ──────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('happy path: returns user and token', async () => {
      const hashed = await bcrypt.hash('correctPass', 10);
      mockDb.query.mockResolvedValueOnce({
        rows: [{ id: 'u1', email: 'a@b.com', name: 'Alice', role: 'student', password: hashed }],
      });

      const result = await service.login({ email: 'a@b.com', password: 'correctPass' });

      expect(result.token).toBe('mock.jwt.token');
      expect(result.user).toMatchObject({ id: 'u1', email: 'a@b.com' });
    });

    it('throws UnauthorizedException when user not found', async () => {
      mockDb.query.mockResolvedValueOnce({ rows: [] });

      await expect(
        service.login({ email: 'nope@b.com', password: 'any' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException on wrong password', async () => {
      const hashed = await bcrypt.hash('realPass', 10);
      mockDb.query.mockResolvedValueOnce({
        rows: [{ id: 'u1', email: 'a@b.com', password: hashed, role: 'student', name: 'A' }],
      });

      await expect(
        service.login({ email: 'a@b.com', password: 'wrongPass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ── getMe ──────────────────────────────────────────────────────────────────

  describe('getMe', () => {
    it('happy path: returns user profile', async () => {
      mockDb.query.mockResolvedValueOnce({
        rows: [{ id: 'u1', email: 'a@b.com', name: 'Alice', age: 22, role: 'student', school: 'ALU' }],
      });

      const user = await service.getMe('u1');
      expect(user.email).toBe('a@b.com');
    });

    it('throws NotFoundException when user not found', async () => {
      mockDb.query.mockResolvedValueOnce({ rows: [] });

      await expect(service.getMe('ghost')).rejects.toThrow(NotFoundException);
    });
  });
});
