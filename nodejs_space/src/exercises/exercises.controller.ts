import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ExercisesService } from './exercises.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Exercises')
@ApiBearerAuth()
@Controller('api/exercises')
@UseGuards(JwtAuthGuard)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get all exercises for a lesson' })
  @ApiParam({ name: 'lessonId', description: 'Lesson ID', type: Number })
  @ApiResponse({ status: 200, description: 'Exercises retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Lesson already completed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async getExercisesByLesson(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @CurrentUser() user: any,
  ) {
    return this.exercisesService.getExercisesByLesson(lessonId, user.id);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit answer to an exercise' })
  @ApiResponse({ status: 200, description: 'Answer submitted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  async submitAnswer(
    @CurrentUser() user: any,
    @Body() submitAnswerDto: SubmitAnswerDto,
  ) {
    return this.exercisesService.submitAnswer(user.id, submitAnswerDto);
  }
}