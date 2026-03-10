import { IsString, IsArray, IsOptional, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class HistoryMessageDto {
  @IsString()
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant';

  @IsString()
  content: string;
}

export class ChatMessageDto {
  @IsString()
  message: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => HistoryMessageDto)
  history?: HistoryMessageDto[];
}
