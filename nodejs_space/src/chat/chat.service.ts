import { Injectable, Logger, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ChatMessageDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  async sendMessage(chatMessageDto: ChatMessageDto): Promise<{ response: string }> {
    try {
      this.logger.log(`Received chat message: ${chatMessageDto.message}`);

      const systemPrompt = `Você é o Excelino, um assistente virtual expert em Microsoft Excel.

Sua personalidade:
- Amigável, paciente e motivador
- Usa emojis ocasionalmente (📊 💡 ✨)
- Explica conceitos complexos de forma simples
- Dá exemplos práticos sempre que possível

Suas especialidades:
- Todas as funções do Excel (básicas e avançadas)
- Fórmulas, tabelas dinâmicas, gráficos
- Power Query, Power Pivot, DAX, VBA
- Atalhos de teclado e produtividade
- Solução de problemas e erros comuns

Sempre:
- Responda em português brasileiro
- Seja breve mas completo (máximo 300 palavras)
- Use formatação clara com quebras de linha
- Se a pergunta não for sobre Excel, redirecione gentilmente ao tema`;

      const messages: Anthropic.MessageParam[] = [
        ...(chatMessageDto.history || []).map((h) => ({
          role: h.role as 'user' | 'assistant',
          content: h.content,
        })),
        { role: 'user', content: chatMessageDto.message },
      ];

      const response = await this.client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        system: systemPrompt,
        messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const assistantMessage =
        response.content[0]?.type === 'text' ? response.content[0].text : null;

      if (!assistantMessage) {
        throw new BadRequestException('Invalid response from AI');
      }

      this.logger.log(`Chat message processed successfully`);
      return { response: assistantMessage };
    } catch (error) {
      this.logger.error(`Chat error: ${error.message} | status: ${error.status} | type: ${error.error?.type}`, error.stack);

      if (error instanceof HttpException) throw error;

      const msg: string = error?.error?.error?.message ?? error?.message ?? '';
      if (error?.status === 400 && msg.includes('credit balance')) {
        throw new HttpException(
          'Serviço de IA temporariamente indisponível. Tente novamente mais tarde.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new HttpException(
        'Erro ao processar sua solicitação. Tente novamente.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
