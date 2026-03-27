import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { BookSessionDto } from './dto/book-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/types';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  // ── Public ────────────────────────────────────────────────────────────────

  @Get('counselors')
  @ApiOperation({ summary: 'List all available counselors' })
  @ApiResponse({
    status: 200,
    description: 'Array of counselor profiles.',
    schema: {
      example: [{ id: 'uuid', name: 'Dr. Jane', specialization: 'CBT', available_hours: 'Mon-Fri 9-17' }],
    },
  })
  getCounselors() {
    return this.sessionsService.getCounselors();
  }

  // ── Protected ─────────────────────────────────────────────────────────────

  @Post('book')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Book a counseling session (student)' })
  @ApiResponse({ status: 201, description: 'Session created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  bookSession(@Body() dto: BookSessionDto, @CurrentUser() user: JwtPayload) {
    return this.sessionsService.bookSession(dto, user.id);
  }

  @Get('my-sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: "Get the authenticated student's sessions" })
  @ApiResponse({ status: 200, description: "Student's sessions with counselor names." })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMySessions(@CurrentUser() user: JwtPayload) {
    return this.sessionsService.getMySessions(user.id);
  }

  @Get('counselor-sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: "Get the authenticated counselor's assigned sessions" })
  @ApiResponse({ status: 200, description: "Counselor's sessions with student info." })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getCounselorSessions(@CurrentUser() user: JwtPayload) {
    return this.sessionsService.getCounselorSessions(user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update session status / notes' })
  @ApiParam({ name: 'id', description: 'Session UUID' })
  @ApiResponse({ status: 200, description: 'Updated session row.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  updateSession(@Param('id') id: string, @Body() dto: UpdateSessionDto) {
    return this.sessionsService.updateSession(id, dto);
  }
}
