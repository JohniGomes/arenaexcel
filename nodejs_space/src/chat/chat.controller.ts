import { Controller, Post, Body, UseGuards, Request, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatMessageDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Chat')
@Controller('api/chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  @Post('message')
  @ApiOperation({ summary: 'Send message to Excelino AI assistant' })
  async sendMessage(@Request() req: any, @Body() chatMessageDto: ChatMessageDto) {
    // Note: Chat limit is enforced on frontend via AsyncStorage
    // Backend validation would require a ChatMessage table which is not needed for MVP
    // Premium users can be verified here if needed for future features

    const response = await this.chatService.sendMessage(chatMessageDto);

    // Incrementar totalIaUsos
    try {
      await this.prisma.users.update({
        where: { id: req?.user?.id },
        data: { totalIaUsos: { increment: 1 } },
      });
    } catch (error) {
      // Não quebrar a requisição se falhar
      console.error('Erro ao incrementar totalIaUsos:', error);
    }

    return response;
  }
}
