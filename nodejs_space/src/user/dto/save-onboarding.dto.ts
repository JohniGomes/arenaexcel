import { IsString, IsArray, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveOnboardingDto {
  @ApiProperty({ example: 'intermediate' })
  @IsString()
  level: string;

  @ApiProperty({ example: ['career', 'analysis'] })
  @IsArray()
  goals: string[];

  @ApiProperty({ example: 10 })
  @IsInt()
  studyTime: number;

  @ApiProperty({ example: 'financial' })
  @IsString()
  area: string;

  @ApiProperty({ example: ['formulas', 'pivot'] })
  @IsArray()
  challenges: string[];
}
