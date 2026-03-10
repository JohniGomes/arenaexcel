import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Progress')
@ApiBearerAuth()
@Controller('api/progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  @ApiOperation({ summary: 'Get user progress across all levels' })
  @ApiResponse({ status: 200, description: 'Progress retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProgress(@CurrentUser() user: any) {
    return this.progressService.getProgress(user.id);
  }

  @Post('lesson')
  @ApiOperation({ summary: 'Update lesson completion status' })
  @ApiResponse({ status: 200, description: 'Lesson progress updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateLesson(
    @CurrentUser() user: any,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.progressService.updateLesson(user.id, updateLessonDto);
  }
}