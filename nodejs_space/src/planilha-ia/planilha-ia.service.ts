import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlanilhaIAService {
  private readonly logger = new Logger(PlanilhaIAService.name);
  private abacusApiKey = process.env.ABACUSAI_API_KEY;
  private abacusApiUrl = 'https://apps.abacus.ai/v1/chat/completions';

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
      // Análises ilimitadas para usuários premium
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

      const response = await fetch(this.abacusApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.abacusApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'Você é o Excelino, especialista em Excel e análise de dados.',
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: 1500,
          temperature: 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`API error: ${response.status} - ${errorText}`);
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();

      // Não precisa mais registrar uso (análises ilimitadas)
      // await this.registrarUso(userId);

      const insights = data?.choices?.[0]?.message?.content ?? 'Análise não disponível.';

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

      const response = await fetch(this.abacusApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.abacusApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            ...mensagens,
          ],
          max_tokens: 800,
          temperature: 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`API error: ${response.status} - ${errorText}`);
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      const resposta = data?.choices?.[0]?.message?.content ?? 'Resposta não disponível.';

      return { resposta };
    } catch (error) {
      this.logger.error(`Erro no chat: ${error.message}`, error.stack);
      throw new HttpException('Não foi possível processar sua mensagem', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ── Extrair texto de imagem ───────────────────────────────
  async extrairDaImagem(userId: string, base64: string) {
    try {
      const response = await fetch(this.abacusApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.abacusApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extraia todos os dados desta planilha/tabela em formato CSV (separado por ponto e vírgula). Inclua cabeçalhos. Retorne apenas os dados, sem explicação.',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 2000,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`API error: ${response.status} - ${errorText}`);
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      const texto = data?.choices?.[0]?.message?.content ?? '';

      return { texto };
    } catch (error) {
      this.logger.error(`Erro ao extrair imagem: ${error.message}`, error.stack);
      throw new HttpException('Não foi possível processar a imagem', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
