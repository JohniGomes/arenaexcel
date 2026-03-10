import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const BADGES_CONFIG = {
  nivel_fundamentos: { nome: 'Mestre dos Fundamentos', tipo: 'certificado', emoji: '🥉' },
  nivel_basico:      { nome: 'Planilheiro Básico',     tipo: 'certificado', emoji: '🥈' },
  nivel_intermediario: { nome: 'Analista Excel',       tipo: 'certificado', emoji: '🥇' },
  nivel_avancado:    { nome: 'Expert Excel',           tipo: 'certificado', emoji: '🏆' },
  nivel_especialista:{ nome: 'Mestre Excel',           tipo: 'certificado', emoji: '👑' },
  streak_7:          { nome: 'Sequência de Fogo',      tipo: 'badge',       emoji: '🔥' },
  streak_30:         { nome: 'Mês Dedicado',           tipo: 'badge',       emoji: '💎' },
  streak_100:        { nome: 'Lendário',               tipo: 'badge',       emoji: '⚡' },
  exercicios_50:     { nome: 'Praticante',             tipo: 'badge',       emoji: '📝' },
  exercicios_100:    { nome: 'Veterano',               tipo: 'badge',       emoji: '🎯' },
  exercicios_250:    { nome: 'Elite',                  tipo: 'badge',       emoji: '🚀' },
  ia_10:             { nome: 'Analista IA',            tipo: 'badge',       emoji: '🤖' },
  ia_50:             { nome: 'Cientista de Dados',     tipo: 'badge',       emoji: '🧠' },
  dias_7:            { nome: 'Uma Semana',             tipo: 'badge',       emoji: '📅' },
  dias_30:           { nome: 'Um Mês',                 tipo: 'badge',       emoji: '🗓️' },
};

@Injectable()
export class BadgesService {
  private readonly logger = new Logger(BadgesService.name);

  constructor(private prisma: PrismaService) {}

  async verificarEConcederBadges(userId: string): Promise<string[]> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
        include: { 
          badges: true, 
          userprogress: true 
        },
      });

      if (!user) return [];

      const badgesJaTem = user?.badges?.map((b: any) => b?.badgeId) ?? [];
      const novosBadges: string[] = [];

      // ── Streak ──
      const streak = user?.streak ?? 0;
      if (streak >= 7   && !badgesJaTem.includes('streak_7'))   novosBadges.push('streak_7');
      if (streak >= 30  && !badgesJaTem.includes('streak_30'))  novosBadges.push('streak_30');
      if (streak >= 100 && !badgesJaTem.includes('streak_100')) novosBadges.push('streak_100');

      // ── Exercícios ──
      const totalEx = user?.totalExercicios ?? 0;
      if (totalEx >= 50  && !badgesJaTem.includes('exercicios_50'))  novosBadges.push('exercicios_50');
      if (totalEx >= 100 && !badgesJaTem.includes('exercicios_100')) novosBadges.push('exercicios_100');
      if (totalEx >= 250 && !badgesJaTem.includes('exercicios_250')) novosBadges.push('exercicios_250');

      // ── Uso da IA ──
      const totalIA = user?.totalIaUsos ?? 0;
      if (totalIA >= 10 && !badgesJaTem.includes('ia_10')) novosBadges.push('ia_10');
      if (totalIA >= 50 && !badgesJaTem.includes('ia_50')) novosBadges.push('ia_50');

      // ── Dias consecutivos ──
      const diasConsecutivos = user?.diasConsecutivos ?? 0;
      if (diasConsecutivos >= 7  && !badgesJaTem.includes('dias_7'))  novosBadges.push('dias_7');
      if (diasConsecutivos >= 30 && !badgesJaTem.includes('dias_30')) novosBadges.push('dias_30');

      // ── Níveis concluídos ──
      // Vou verificar se todos os exercícios de um nível foram concluídos
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

      const mapaNiveis: Record<string, string> = {
        'Fundamentos': 'nivel_fundamentos',
        'Básico': 'nivel_basico',
        'Intermediário': 'nivel_intermediario',
        'Avançado': 'nivel_avancado',
        'Especialista': 'nivel_especialista',
      };

      for (const level of levels) {
        const badgeId = mapaNiveis[level?.name];
        if (!badgeId || badgesJaTem.includes(badgeId)) continue;

        // Verificar se completou todos os exercícios do nível
        const exerciciosDoNivel = level?.lessons?.flatMap(l => l?.exercises ?? []) ?? [];
        const exerciciosIds = exerciciosDoNivel.map(e => e?.id).filter(Boolean);

        if (exerciciosIds.length === 0) continue;

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

      // Salvar novos badges no banco
      if (novosBadges.length > 0) {
        await this.prisma.badges.createMany({
          data: novosBadges.map(badgeId => ({
            userId,
            badgeId,
            tipo: (BADGES_CONFIG as any)[badgeId]?.tipo ?? 'badge',
          })),
          skipDuplicates: true,
        });

        this.logger.log(`Novos badges concedidos para ${userId}: ${novosBadges.join(', ')}`);
      }

      return novosBadges;
    } catch (error) {
      this.logger.error(`Erro ao verificar badges: ${error}`);
      return [];
    }
  }

  async getBadgesUsuario(userId: string) {
    const badges = await this.prisma.badges.findMany({
      where: { userId },
      orderBy: { criadoEm: 'asc' },
    });

    // Retornar todos os badges com status (conquistado ou não)
    return Object.entries(BADGES_CONFIG).map(([id, config]) => {
      const conquistado = badges.find((b: any) => b?.badgeId === id);
      return {
        id,
        ...config,
        conquistado: !!conquistado,
        dataConquista: conquistado?.criadoEm ?? null,
      };
    });
  }

  async gerarCertificado(userId: string, badgeId: string, nomeAluno: string) {
    const config = (BADGES_CONFIG as any)[badgeId];
    if (!config || config.tipo !== 'certificado') {
      throw new Error('Badge não é um certificado');
    }

    return this.prisma.badges.upsert({
      where: { userId_badgeId: { userId, badgeId } },
      update: { nomeAluno },
      create: { userId, badgeId, tipo: 'certificado', nomeAluno },
    });
  }

  async validarCertificado(id: string) {
    const cert = await this.prisma.badges.findUnique({
      where: { id },
      include: { user: { select: { name: true } } },
    });

    if (!cert || cert?.tipo !== 'certificado') return null;

    const config = (BADGES_CONFIG as any)[cert?.badgeId];
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
}
