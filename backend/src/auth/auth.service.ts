import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../common/types';

export interface UserRow {
  id: string;
  email: string;
  password: string;
  name: string;
  age: number | null;
  role: string;
  school: string | null;
  created_at: Date;
  specialization?: string;
  available_hours?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.db.query<{ id: string }>(
      'SELECT id FROM users WHERE email = $1',
      [dto.email],
    );

    if (existing.rows.length > 0) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.db.query<Pick<UserRow, 'id' | 'email' | 'name' | 'role'>>(
      `INSERT INTO users (email, password, name, age, role, school, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, email, name, role`,
      [
        dto.email,
        hashedPassword,
        dto.name,
        dto.age ?? null,
        dto.role ?? 'student',
        dto.school ?? null,
      ],
    );

    const user = result.rows[0];
    const token = this.signToken(user);
    return { user, token };
  }

  async login(dto: LoginDto) {
    const result = await this.db.query<UserRow>(
      'SELECT * FROM users WHERE email = $1',
      [dto.email],
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(dto.password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.signToken(user);
    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    };
  }

  async getMe(userId: string) {
    const result = await this.db.query<Omit<UserRow, 'password' | 'created_at'>>(
      'SELECT id, email, name, age, role, school FROM users WHERE id = $1',
      [userId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('User not found');
    }

    return result.rows[0];
  }

  private signToken(user: { id: string; email: string; role: string }): string {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role as JwtPayload['role'],
    };
    return this.jwtService.sign(payload);
  }
}
