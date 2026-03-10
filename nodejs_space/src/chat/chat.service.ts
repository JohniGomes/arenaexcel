import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ChatMessageDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly apiKey = process.env.ABACUSAI_API_KEY;
  private readonly apiUrl = 'https://apps.abacus.ai/v1/chat/completions';

  async sendMessage(chatMessageDto: ChatMessageDto): Promise<{ response: string }> {
    try {
      this.logger.log(`Received chat message: ${chatMessageDto.message}`);
      
      if (!this.apiKey) {
        this.logger.error('ABACUSAI_API_KEY not configured');
        throw new BadRequestException('API key not configured');
      }

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

      const messages = [
        { role: 'system', content: systemPrompt },
        ...(chatMessageDto.history || []),
        { role: 'user', content: chatMessageDto.message },
      ];

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          messages,
          model: 'gpt-4o',
          stream: false,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        this.logger.error(`LLM API error: ${response.status} - ${errorData}`);
        throw new BadRequestException('Failed to get response from AI');
      }

      const data = await response.json();
      const assistantMessage = data?.choices?.[0]?.message?.content;

      if (!assistantMessage) {
        throw new BadRequestException('Invalid response from AI');
      }

      this.logger.log(`Chat message processed successfully`);

      return {
        response: assistantMessage,
      };
    } catch (error) {
      this.logger.error(`Chat error: ${error.message}`, error.stack);
      throw error;
    }
  }
}
