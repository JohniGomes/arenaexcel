import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Achievements')
@ApiBearerAuth()
@Controller('api/achievements')
@UseGuards(JwtAuthGuard)
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all achievements and unlock status' })
  @ApiResponse({ status: 200, description: 'Achievements retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAchievements(@CurrentUser() user: any) {
    return this.achievementsService.getAchievements(user.id);
  }
}