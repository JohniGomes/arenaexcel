import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TrailsService } from './trails.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@ApiTags('Trails')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trails')
export class TrailsController {
  constructor(private readonly trailsService: TrailsService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.trailsService.findAllWithProgress(user.id);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @CurrentUser() user: any) {
    return this.trailsService.findOneWithQuestions(slug, user.id);
  }

  @Get(':slug/questions/:order')
  getQuestion(
    @Param('slug') slug: string,
    @Param('order') order: string,
    @CurrentUser() user: any,
  ) {
    return this.trailsService.getQuestion(slug, parseInt(order), user.id);
  }

  @Post('answer')
  submitAnswer(@CurrentUser() user: any, @Body() dto: SubmitAnswerDto) {
    return this.trailsService.submitAnswer(
      user.id,
      dto.questionId,
      dto.value,
      dto.timeSpentMs ?? 0,
    );
  }
}
