"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
let ChatService = ChatService_1 = class ChatService {
    logger = new common_1.Logger(ChatService_1.name);
    apiKey = process.env.ABACUSAI_API_KEY;
    apiUrl = 'https://apps.abacus.ai/v1/chat/completions';
    async sendMessage(chatMessageDto) {
        try {
            this.logger.log(`Received chat message: ${chatMessageDto.message}`);
            if (!this.apiKey) {
                this.logger.error('ABACUSAI_API_KEY not configured');
                throw new common_1.BadRequestException('API key not configured');
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
                throw new common_1.BadRequestException('Failed to get response from AI');
            }
            const data = await response.json();
            const assistantMessage = data?.choices?.[0]?.message?.content;
            if (!assistantMessage) {
                throw new common_1.BadRequestException('Invalid response from AI');
            }
            this.logger.log(`Chat message processed successfully`);
            return {
                response: assistantMessage,
            };
        }
        catch (error) {
            this.logger.error(`Chat error: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)()
], ChatService);
//# sourceMappingURL=chat.service.js.map