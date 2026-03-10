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
var BadgesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const BADGES_CONFIG = {
    nivel_fundamentos: { nome: 'Mestre dos Fundamentos', tipo: 'certificado', emoji: '🥉' },
    nivel_basico: { nome: 'Planilheiro Básico', tipo: 'certificado', emoji: '🥈' },
    nivel_intermediario: { nome: 'Analista Excel', tipo: 'certificado', emoji: '🥇' },
    nivel_avancado: { nome: 'Expert Excel', tipo: 'certificado', emoji: '🏆' },
    nivel_especialista: { nome: 'Mestre Excel', tipo: 'certificado', emoji: '👑' },
    streak_7: { nome: 'Sequência de Fogo', tipo: 'badge', emoji: '🔥' },
    streak_30: { nome: 'Mês Dedicado', tipo: 'badge', emoji: '💎' },
    streak_100: { nome: 'Lendário', tipo: 'badge', emoji: '⚡' },
    exercicios_50: { nome: 'Praticante', tipo: 'badge', emoji: '📝' },
    exercicios_100: { nome: 'Veterano', tipo: 'badge', emoji: '🎯' },
    exercicios_250: { nome: 'Elite', tipo: 'badge', emoji: '🚀' },
    ia_10: { nome: 'Analista IA', tipo: 'badge', emoji: '🤖' },
    ia_50: { nome: 'Cientista de Dados', tipo: 'badge', emoji: '🧠' },
    dias_7: { nome: 'Uma Semana', tipo: 'badge', emoji: '📅' },
    dias_30: { nome: 'Um Mês', tipo: 'badge', emoji: '🗓️' },
};
let BadgesService = BadgesService_1 = class BadgesService {
    prisma;
    logger = new common_1.Logger(BadgesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verificarEConcederBadges(userId) {
        try {
            const user = await this.prisma.users.findUnique({
                where: { id: userId },
                include: {
                    badges: true,
                    userprogress: true
                },
            });
            if (!user)
                return [];
            const badgesJaTem = user?.badges?.map((b) => b?.badgeId) ?? [];
            const novosBadges = [];
            const streak = user?.streak ?? 0;
            if (streak >= 7 && !badgesJaTem.includes('streak_7'))
                novosBadges.push('streak_7');
            if (streak >= 30 && !badgesJaTem.includes('streak_30'))
                novosBadges.push('streak_30');
            if (streak >= 100 && !badgesJaTem.includes('streak_100'))
                novosBadges.push('streak_100');
            const totalEx = user?.totalExercicios ?? 0;
            if (totalEx >= 50 && !badgesJaTem.includes('exercicios_50'))
                novosBadges.push('exercicios_50');
            if (totalEx >= 100 && !badgesJaTem.includes('exercicios_100'))
                novosBadges.push('exercicios_100');
            if (totalEx >= 250 && !badgesJaTem.includes('exercicios_250'))
                novosBadges.push('exercicios_250');
            const totalIA = user?.totalIaUsos ?? 0;
            if (totalIA >= 10 && !badgesJaTem.includes('ia_10'))
                novosBadges.push('ia_10');
            if (totalIA >= 50 && !badgesJaTem.includes('ia_50'))
                novosBadges.push('ia_50');
            const diasConsecutivos = user?.diasConsecutivos ?? 0;
            if (diasConsecutivos >= 7 && !badgesJaTem.includes('dias_7'))
                novosBadges.push('dias_7');
            if (diasConsecutivos >= 30 && !badgesJaTem.includes('dias_30'))
                novosBadges.push('dias_30');
            const levels = await this.prisma.levels.findMany({
                include: {
                    lessons: {
                        include: {
                            exercises: true
                        }
                    }
                },
                orderBy: { order: 'asc' }
            });
            const mapaNiveis = {
                'Fundamentos': 'nivel_fundamentos',
                'Básico': 'nivel_basico',
                'Intermediário': 'nivel_intermediario',
                'Avançado': 'nivel_avancado',
                'Especialista': 'nivel_especialista',
            };
            for (const level of levels) {
                const badgeId = mapaNiveis[level?.name];
                if (!badgeId || badgesJaTem.includes(badgeId))
                    continue;
                const exerciciosDoNivel = level?.lessons?.flatMap(l => l?.exercises ?? []) ?? [];
                const exerciciosIds = exerciciosDoNivel.map(e => e?.id).filter(Boolean);
                if (exerciciosIds.length === 0)
                    continue;
                const exerciciosCompletos = await this.prisma.userexerciseattempts.findMany({
                    where: {
                        userid: userId,
                        exerciseid: { in: exerciciosIds },
                        correct: true
                    },
                    distinct: ['exerciseid']
                });
                if (exerciciosCompletos.length === exerciciosIds.length) {
                    novosBadges.push(badgeId);
                }
            }
            if (novosBadges.length > 0) {
                await this.prisma.badges.createMany({
                    data: novosBadges.map(badgeId => ({
                        userId,
                        badgeId,
                        tipo: BADGES_CONFIG[badgeId]?.tipo ?? 'badge',
                    })),
                    skipDuplicates: true,
                });
                this.logger.log(`Novos badges concedidos para ${userId}: ${novosBadges.join(', ')}`);
            }
            return novosBadges;
        }
        catch (error) {
            this.logger.error(`Erro ao verificar badges: ${error}`);
            return [];
        }
    }
    async getBadgesUsuario(userId) {
        const badges = await this.prisma.badges.findMany({
            where: { userId },
            orderBy: { criadoEm: 'asc' },
        });
        return Object.entries(BADGES_CONFIG).map(([id, config]) => {
            const conquistado = badges.find((b) => b?.badgeId === id);
            return {
                id,
                ...config,
                conquistado: !!conquistado,
                dataConquista: conquistado?.criadoEm ?? null,
            };
        });
    }
    async gerarCertificado(userId, badgeId, nomeAluno) {
        const config = BADGES_CONFIG[badgeId];
        if (!config || config.tipo !== 'certificado') {
            throw new Error('Badge não é um certificado');
        }
        return this.prisma.badges.upsert({
            where: { userId_badgeId: { userId, badgeId } },
            update: { nomeAluno },
            create: { userId, badgeId, tipo: 'certificado', nomeAluno },
        });
    }
    async validarCertificado(id) {
        const cert = await this.prisma.badges.findUnique({
            where: { id },
            include: { user: { select: { name: true } } },
        });
        if (!cert || cert?.tipo !== 'certificado')
            return null;
        const config = BADGES_CONFIG[cert?.badgeId];
        return {
            valido: true,
            id: cert?.id,
            nomeAluno: cert?.nomeAluno ?? cert?.user?.name,
            curso: config?.nome ?? 'Excel',
            nivel: cert?.badgeId,
            emoji: config?.emoji,
            dataConquista: cert?.criadoEm,
            emissor: 'Arena Excel',
        };
    }
};
exports.BadgesService = BadgesService;
exports.BadgesService = BadgesService = BadgesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BadgesService);
//# sourceMappingURL=badges.service.js.map