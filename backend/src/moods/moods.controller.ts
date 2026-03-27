import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min } from 'class-validator';
import { MoodsService } from './moods.service';
import { MoodCheckinDto } from './dto/mood-checkin.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/types';

@ApiTags('moods')
@Controller('moods')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class MoodsController {
  constructor(private readonly moodsService: MoodsService) {}

  @Post('checkin')
  @ApiOperation({ summary: 'Record a mood check-in' })
  @ApiResponse({ status: 201, description: 'Mood check-in saved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  checkin(@Body() dto: MoodCheckinDto, @CurrentUser() user: JwtPayload) {
    return this.moodsService.checkin(dto, user.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get mood history and streak' })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    example: 30,
    description: 'Number of days to look back (default 30)',
  })
  @ApiResponse({
    status: 200,
    description: 'Mood history array and current streak.',
    schema: {
      example: {
        moods: [{ id: 'uuid', mood: 'calm', intensity: 7, created_at: '2024-05-01T10:00:00Z' }],
        streak: 5,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getHistory(
    @CurrentUser() user: JwtPayload,
    @Query('days') days = 30,
  ) {
    return this.moodsService.getHistory(user.id, Number(days));
  }
}
