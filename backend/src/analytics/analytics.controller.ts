import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/types';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('admin')
  @Roles('admin')
  @ApiOperation({ summary: 'Platform-wide stats – admin only' })
  @ApiResponse({ status: 200, description: 'Aggregated platform statistics.' })
  @ApiResponse({ status: 403, description: 'Forbidden – admin only.' })
  getAdminStats() {
    return this.analyticsService.getAdminStats();
  }

  @Get('dashboard')
  @Roles('counselor', 'admin')
  @ApiOperation({ summary: 'Analytics dashboard – counselor / admin only' })
  @ApiResponse({
    status: 200,
    description: 'Aggregated session statistics for the authenticated counselor.',
    schema: {
      example: {
        totalSessions: 42,
        completedSessions: 30,
        commonIssues: [
          { topic: 'Anxiety', count: '12' },
          { topic: 'Academic stress', count: '8' },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden – requires counselor or admin role.' })
  getDashboard(@CurrentUser() user: JwtPayload) {
    return this.analyticsService.getDashboard(user.id);
  }
}
