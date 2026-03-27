import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ── Register ──────────────────────────────────────────────────────────────

  @Post('register')
  @Throttle({ default: { limit: 10, ttl: 60_000 } }) // stricter: 10/min on auth
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered. Returns { user, token }.',
    schema: {
      example: {
        user: { id: 'uuid', email: 'john@example.com', name: 'John Doe', role: 'student' },
        token: 'eyJhbGciOiJIUzI1NiIs…',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error – missing or invalid fields.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ── Login ─────────────────────────────────────────────────────────────────

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Login and obtain a JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns { user, token }.',
    schema: {
      example: {
        user: { id: 'uuid', email: 'john@example.com', name: 'John Doe', role: 'student' },
        token: 'eyJhbGciOiJIUzI1NiIs…',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ── Me ────────────────────────────────────────────────────────────────────

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get the currently authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile (no password).',
    schema: {
      example: {
        id: 'uuid',
        email: 'john@example.com',
        name: 'John Doe',
        age: 22,
        role: 'student',
        school: 'ALU Rwanda',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No / invalid token.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  getMe(@CurrentUser() user: JwtPayload) {
    return this.authService.getMe(user.id);
  }
}
