import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export const BADGES_CONFIG: Record<string, { nome: string; categoria: string; descricao: string; icone: string }> = {
  // ── Sequência & Dedicação ──────────────────────────────────
  streak_7:          { nome: 'Uma Semana',          categoria: 'sequencia',       icone: '🔥', descricao: 'Estude 7 dias consecutivos sem falhar' },
  streak_15:         { nome: 'Sequência de Fogo',   categoria: 'sequencia',       icone: '🚀', descricao: 'Mantenha 15 dias seguidos de estudo' },
  streak_30:         { nome: 'Um Mês',              categoria: 'sequencia',       icone: '📅', descricao: 'Complete 30 dias consecutivos estudando' },
  streak_60:         { nome: 'Maratonista',         categoria: 'sequencia',       icone: '🏃', descricao: '60 dias seguidos — sua determinação é impressionante!' },
  streak_100:        { nome: 'Imparável',           categoria: 'sequencia',       icone: '⚡', descricao: '100 dias consecutivos de estudo diário' },
  streak_365:        { nome: 'Lendário',            categoria: 'sequencia',       icone: '👑', descricao: '365 dias seguidos — você é uma lenda do Excel!' },

  // ── Progresso de Aprendizado ───────────────────────────────
  licoes_10:         { nome: 'Praticante',          categoria: 'progresso',       icone: '📖', descricao: 'Complete suas primeiras 10 lições no app' },
  licoes_30:         { nome: 'Veterano',            categoria: 'progresso',       icone: '🎖️', descricao: 'Complete 30 lições e mostre sua evolução' },
  licoes_50:         { nome: 'Elite',               categoria: 'progresso',       icone: '💎', descricao: '50 lições concluídas — você é da elite!' },
  trilhas_10:        { nome: 'Mestre das Trilhas',  categoria: 'progresso',       icone: '🗺️', descricao: 'Conclua todas as 10 trilhas interativas' },
  completista:       { nome: 'Completista',         categoria: 'progresso',       icone: '✅', descricao: 'Conclua todas as lições clássicas E todas as trilhas' },
  wiki_explorador:   { nome: 'Explorador',          categoria: 'progresso',       icone: '🔍', descricao: 'Acesse todas as 11 áreas profissionais da Wiki' },

  // ── Desempenho ─────────────────────────────────────────────
  primeira_vitoria:  { nome: 'Primeira Vitória',    categoria: 'desempenho',      icone: '🏆', descricao: 'Acerte sua primeira questão no app — o início de tudo!' },
  precisao_10:       { nome: 'Precisão Cirúrgica',  categoria: 'desempenho',      icone: '🎯', descricao: 'Acerte 10 questões consecutivas sem errar nenhuma' },
  trilha_sem_erro:   { nome: 'Sem Erros',           categoria: 'desempenho',      icone: '⭐', descricao: 'Complete uma trilha inteira sem errar nenhuma questão' },
  velocista:         { nome: 'Velocista',           categoria: 'desempenho',      icone: '💨', descricao: 'Conclua uma lição completa em menos de 2 minutos' },
  mes_dedicado:      { nome: 'Mês Dedicado',        categoria: 'desempenho',      icone: '📆', descricao: 'Estude pelo menos 20 dias diferentes em um mesmo mês' },
  nota_10:           { nome: 'Nota 10',             categoria: 'desempenho',      icone: '💯', descricao: 'Termine uma trilha com 100% de precisão nas respostas' },

  // ── Funcionalidades ────────────────────────────────────────
  ia_analista:       { nome: 'Analista IA',         categoria: 'funcionalidades', icone: '🤖', descricao: 'Use o Excelino IA para analisar sua primeira planilha' },
  cientista_dados:   { nome: 'Cientista de Dados',  categoria: 'funcionalidades', icone: '🔬', descricao: 'Aprenda e use 5 fórmulas avançadas nas trilhas' },
  consultor_ia:      { nome: 'Consultor',           categoria: 'funcionalidades', icone: '📊', descricao: 'Envie 10 planilhas diferentes para análise com IA' },
  wiki_master:       { nome: 'Wiki Master',         categoria: 'funcionalidades', icone: '📚', descricao: 'Leia conteúdo de todas as 11 áreas da Wiki do Excel' },

  // ── Especiais ──────────────────────────────────────────────
  pioneiro:          { nome: 'Pioneiro',            categoria: 'especiais',       icone: '🌟', descricao: 'Você está entre os primeiros usuários do Arena Excel!' },
  embaixador:        { nome: 'Embaixador',          categoria: 'especiais',       icone: '🤝', descricao: 'Indique 3 amigos que se cadastrarem no Arena Excel' },
  premium_badge:     { nome: 'Premium',             categoria: 'especiais',       icone: '💫', descricao: 'Assine o plano Premium e desbloqueie todo o potencial' },
  certificado_badge: { nome: 'Certificado',         categoria: 'especiais',       icone: '🎓', descricao: 'Emita seu primeiro certificado oficial do Arena Excel' },
  excel_supreme:     { nome: 'Excel Supreme',       categoria: 'especiais',       icone: '👾', descricao: 'Atinja o nível máximo 20 — Excel Supreme!' },
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
          userprogress: { where: { status: 'completed' } },
          useranswers: { orderBy: { createdAt: 'desc' } },
        },
      });

      if (!user) return [];

      const badgesJaTem = user.badges.map((b: any) => b.badgeId);
      const novosBadges: string[] = [];

      const push = (id: string) => {
        if (!badgesJaTem.includes(id)) novosBadges.push(id);
      };

      // ── Streak ──────────────────────────────────────────
      const streak = user.streak ?? 0;
      if (streak >= 7)   push('streak_7');
      if (streak >= 15)  push('streak_15');
      if (streak >= 30)  push('streak_30');
      if (streak >= 60)  push('streak_60');
      if (streak >= 100) push('streak_100');
      if (streak >= 365) push('streak_365');

      // ── Lições (clássicas + trilhas) ─────────────────────
      const licoesConcluidas = user.userprogress.length;
      const trailAnswers = user.useranswers.filter((a: any) => a.isCorrect).length;
      const totalLicoes = licoesConcluidas + trailAnswers;
      if (totalLicoes >= 10) push('licoes_10');
      if (totalLicoes >= 30) push('licoes_30');
      if (totalLicoes >= 50) push('licoes_50');

      // ── Trilhas concluídas ───────────────────────────────
      const trilhasConcluidas = await this.prisma.usertrailprogress.count({
        where: { userId, completedAt: { not: null } },
      });
      if (trilhasConcluidas >= 10) push('trilhas_10');
      if (trilhasConcluidas >= 10 && totalLicoes >= 50) push('completista');

      // ── Primeira vitória ─────────────────────────────────
      const totalAcertos = (user.totalExercicios ?? 0) + trailAnswers;
      if (totalAcertos >= 1) push('primeira_vitoria');

      // ── Precisão cirúrgica (10 consecutivas corretas) ────
      if (!badgesJaTem.includes('precisao_10')) {
        const ultimas10 = user.useranswers.slice(0, 10);
        if (ultimas10.length === 10 && ultimas10.every((a: any) => a.isCorrect)) {
          push('precisao_10');
        }
      }

      // ── IA ───────────────────────────────────────────────
      const totalIA = user.totalIaUsos ?? 0;
      if (totalIA >= 1)  push('ia_analista');
      if (totalIA >= 10) push('consultor_ia');

      // ── Premium ──────────────────────────────────────────
      if ((user as any).isPremium) push('premium_badge');

      // ── Certificado emitido ──────────────────────────────
      const temCertificado = user.badges.some((b: any) => b.tipo === 'certificado');
      if (temCertificado) push('certificado_badge');

      // ── Excel Supreme ─────────────────────────────────────
      if ((user.level ?? 1) >= 20) push('excel_supreme');

      // Salvar novos badges
      if (novosBadges.length > 0) {
        await this.prisma.badges.createMany({
          data: novosBadges.map(badgeId => ({
            userId,
            badgeId,
            tipo: 'badge',
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
    const badgesGanhos = await this.prisma.badges.findMany({
      where: { userId },
      orderBy: { criadoEm: 'asc' },
    });

    return Object.entries(BADGES_CONFIG).map(([id, config]) => {
      const conquistado = badgesGanhos.find((b: any) => b.badgeId === id);
      return {
        id,
        nome: config.nome,
        icone: config.icone,
        categoria: config.categoria,
        descricao: config.descricao,
        conquistado: !!conquistado,
        dataConquista: conquistado?.criadoEm ?? null,
      };
    });
  }

  async getCertificadosEmitidos(userId: string): Promise<string[]> {
    const certs = await this.prisma.badges.findMany({
      where: { userId, tipo: 'certificado' },
      select: { badgeId: true },
    });
    return certs.map((c: any) => c.badgeId);
  }

  async gerarCertificado(userId: string, tipo: string, nomeAluno: string) {
    return this.prisma.badges.upsert({
      where: { userId_badgeId: { userId, badgeId: tipo } },
      update: { nomeAluno },
      create: { userId, badgeId: tipo, tipo: 'certificado', nomeAluno },
    });
  }

  async validarCertificado(id: string) {
    const cert = await this.prisma.badges.findUnique({
      where: { id },
      include: { user: { select: { name: true } } },
    });

    if (!cert || cert.tipo !== 'certificado') return null;

    return {
      valido: true,
      id: cert.id,
      nomeAluno: cert.nomeAluno ?? cert.user?.name,
      curso: cert.badgeId,
      nivel: cert.badgeId,
      dataConquista: cert.criadoEm,
      emissor: 'Arena Excel',
    };
  }
}
