import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VictoriesService } from './victories.service';
import { CreateVictoryDto } from './dto/create-victory.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/types';

@ApiTags('victories')
@Controller('victories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class VictoriesController {
  constructor(private readonly victoriesService: VictoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Log a personal victory' })
  @ApiResponse({ status: 201, description: 'Victory created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() dto: CreateVictoryDto, @CurrentUser() user: JwtPayload) {
    return this.victoriesService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: "Get the current user's victories" })
  @ApiResponse({ status: 200, description: 'List of victories.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getAll(@CurrentUser() user: JwtPayload) {
    return this.victoriesService.getAll(user.id);
  }
}
