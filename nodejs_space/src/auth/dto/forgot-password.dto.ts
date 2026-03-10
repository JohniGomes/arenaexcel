import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'joao@example.com', description: 'Email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}