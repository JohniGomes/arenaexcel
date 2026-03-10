import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MissionsService } from './missions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Missions')
@ApiBearerAuth()
@Controller('api/missions')
@UseGuards(JwtAuthGuard)
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Get daily missions and progress' })
  @ApiResponse({ status: 200, description: 'Daily missions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDailyMissions(@CurrentUser() user: any) {
    return this.missionsService.getDailyMissions(user.id);
  }
}