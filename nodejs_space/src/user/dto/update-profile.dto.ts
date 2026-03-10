import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Maria Silva', description: 'New name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'avatar2', description: 'Avatar identifier', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}