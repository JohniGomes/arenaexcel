import { Controller, Get, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Leaderboard')
@ApiBearerAuth()
@Controller('api/leaderboard')
@UseGuards(JwtAuthGuard)
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get global leaderboard' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of top users to return (default: 100)' })
  @ApiResponse({ status: 200, description: 'Leaderboard retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLeaderboard(
    @CurrentUser() user: any,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
  ) {
    return this.leaderboardService.getLeaderboard(user.id, limit);
  }
}