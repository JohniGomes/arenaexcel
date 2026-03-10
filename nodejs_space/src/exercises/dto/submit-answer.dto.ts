import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAnswerDto {
  @ApiProperty({ example: 1, description: 'Exercise ID' })
  @IsNotEmpty()
  @IsInt()
  exerciseId: number;

  @ApiProperty({ example: 'A', description: 'User answer' })
  @IsNotEmpty()
  @IsString()
  answer: string;
}