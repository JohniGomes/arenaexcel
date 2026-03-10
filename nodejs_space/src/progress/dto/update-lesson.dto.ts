import { IsBoolean, IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLessonDto {
  @ApiProperty({ example: 1, description: 'Lesson ID' })
  @IsNotEmpty()
  @IsInt()
  lessonId: number;

  @ApiProperty({ example: true, description: 'Whether lesson was completed' })
  @IsNotEmpty()
  @IsBoolean()
  completed: boolean;

  @ApiProperty({ example: 100, description: 'XP earned in this lesson' })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  xpEarned: number;
}