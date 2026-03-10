"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PlanilhaIAService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanilhaIAService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PlanilhaIAService = PlanilhaIAService_1 = class PlanilhaIAService {
    prisma;
    logger = new common_1.Logger(PlanilhaIAService_1.name);
    abacusApiKey = process.env.ABACUSAI_API_KEY;
    abacusApiUrl = 'https://apps.abacus.ai/v1/chat/completions';
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verificarLimite(userId) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const usos = await this.prisma.planilhaAnalise.count({
            where: { userId, criadoEm: { gte: hoje } },
        });
        const limite = 3;
        if (usos >= limite) {
            throw new common_1.HttpException('Limite diário de análises atingido', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        return limite - usos - 1;
    }
    async registrarUso(userId) {
        await this.prisma.planilhaAnalise.create({
            data: { userId },
        });
    }
    async analisar(userId, dados, nomeArquivo) {
        try {
            const analisesRestantes = 999;
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
            const insights = data?.choices?.[0]?.message?.content ?? 'Análise não disponível.';
            this.logger.log(`✅ Planilha analisada para usuário ${userId}`);
            return { insights, analisesRestantes };
        }
        catch (error) {
            this.logger.error(`Erro ao analisar planilha: ${error.message}`, error.stack);
            throw new common_1.HttpException('Não foi possível analisar a planilha', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async chat(userId, dados, mensagens) {
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
        }
        catch (error) {
            this.logger.error(`Erro no chat: ${error.message}`, error.stack);
            throw new common_1.HttpException('Não foi possível processar sua mensagem', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async extrairDaImagem(userId, base64) {
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
        }
        catch (error) {
            this.logger.error(`Erro ao extrair imagem: ${error.message}`, error.stack);
            throw new common_1.HttpException('Não foi possível processar a imagem', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PlanilhaIAService = PlanilhaIAService;
exports.PlanilhaIAService = PlanilhaIAService = PlanilhaIAService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlanilhaIAService);
//# sourceMappingURL=planilha-ia.service.js.map