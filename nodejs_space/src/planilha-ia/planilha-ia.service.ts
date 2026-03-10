import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlanilhaIAService {
  private readonly logger = new Logger(PlanilhaIAService.name);
  private readonly client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  constructor(private prisma: PrismaService) {}

  // ── Verificar limite diário ───────────────────────────────
  private async verificarLimite(userId: string): Promise<number> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const usos = await (this.prisma as any).planilhaAnalise.count({
      where: { userId, criadoEm: { gte: hoje } },
    });

    const limite = 3; // 3 análises por dia
    if (usos >= limite) {
      throw new HttpException('Limite diário de análises atingido', HttpStatus.TOO_MANY_REQUESTS);
    }

    return limite - usos - 1;
  }

  // ── Registrar uso ─────────────────────────────────────────
  private async registrarUso(userId: string) {
    await (this.prisma as any).planilhaAnalise.create({
      data: { userId },
    });
  }

  // ── Analisar planilha ─────────────────────────────────────
  async analisar(userId: string, dados: string, nomeArquivo: string) {
    try {
      const analisesRestantes = 999; // Ilimitado

      const prompt = `Você é o Excelino, um especialista em análise de dados e Excel com uma personalidade amigável e didática.

O usuário enviou uma planilha chamada "${nomeArquivo}" com os seguintes dados:

${dados.substring(0, 8000)}

Faça uma análise completa e forneça:

1. 📊 **RESUMO DOS DADOS** — O que são esses dados, quantas linhas/colunas, período coberto

2. 🔍 **INSIGHTS PRINCIPAIS** — Os 3 a 5 insights mais relevantes que você encontrou

3. ⚠️ **PROBLEMAS ENCONTRADOS** — Dados inconsistentes, valores faltando, outliers, erros

4. 📈 **SUGESTÕES DE GRÁFICOS** — Quais visualizações seriam mais úteis e por quê

5. 💡 **PRÓXIMOS PASSOS** — O que o usuário deveria fazer com esses dados

Seja direto, use emojis para facilitar a leitura e explique de forma que qualquer pessoa entenda.`;

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-6',
        system: 'Você é o Excelino, especialista em Excel e análise de dados.',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.7,
      });

      const insights =
        response.content[0]?.type === 'text'
          ? response.content[0].text
          : 'Análise não disponível.';

      this.logger.log(`✅ Planilha analisada para usuário ${userId}`);
      return { insights, analisesRestantes };
    } catch (error) {
      this.logger.error(`Erro ao analisar planilha: ${error.message}`, error.stack);
      throw new HttpException('Não foi possível analisar a planilha', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ── Chat sobre a planilha ─────────────────────────────────
  async chat(userId: string, dados: string, mensagens: { role: string; content: string }[]) {
    try {
      const systemPrompt = `Você é o Excelino, especialista em Excel e análise de dados.
O usuário está perguntando sobre a seguinte planilha:

${dados.substring(0, 6000)}

Responda de forma clara, objetiva e didática. Use emojis quando apropriado.`;

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-6',
        system: systemPrompt,
        messages: mensagens.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        max_tokens: 800,
        temperature: 0.7,
      });

      const resposta =
        response.content[0]?.type === 'text'
          ? response.content[0].text
          : 'Resposta não disponível.';

      return { resposta };
    } catch (error) {
      this.logger.error(`Erro no chat: ${error.message}`, error.stack);
      throw new HttpException('Não foi possível processar sua mensagem', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ── Extrair texto de imagem ───────────────────────────────
  async extrairDaImagem(userId: string, base64: string) {
    try {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-6',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64,
                },
              },
              {
                type: 'text',
                text: 'Extraia todos os dados desta planilha/tabela em formato CSV (separado por ponto e vírgula). Inclua cabeçalhos. Retorne apenas os dados, sem explicação.',
              },
            ],
          },
        ],
        max_tokens: 2000,
      });

      const texto =
        response.content[0]?.type === 'text' ? response.content[0].text : '';

      return { texto };
    } catch (error) {
      this.logger.error(`Erro ao extrair imagem: ${error.message}`, error.stack);
      throw new HttpException('Não foi possível processar a imagem', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
