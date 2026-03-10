import { IsString, IsNumber, IsOptional } from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  questionId: string;

  @IsString()
  value: string;

  @IsNumber()
  @IsOptional()
  timeSpentMs?: number = 0;
}
