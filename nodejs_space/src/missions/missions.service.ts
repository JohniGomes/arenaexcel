import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface MissionDef {
  id: number;
  title: string;
  description: string;
  target: number;
  xpReward: number;
  type: 'lessons' | 'classic_answers' | 'trail_answers' | 'trail_xp' | 'trail_formula' | 'trail_chart' | 'streak';
}

// Pool de missões disponíveis
const MISSION_POOL: MissionDef[] = [
  // Lições clássicas
  { id: 1,  title: 'Complete 3 lições',          description: 'Conclua 3 lições clássicas hoje',            target: 3,  xpReward: 30,  type: 'lessons' },
  { id: 2,  title: 'Acerte 10 questões',          description: 'Responda corretamente 10 exercícios clássicos', target: 10, xpReward: 20,  type: 'classic_answers' },
  { id: 3,  title: 'Mantenha o streak',           description: 'Estude pelo menos 1 dia seguido',            target: 1,  xpReward: 15,  type: 'streak' },
  // Trilhas — questões
  { id: 4,  title: 'Responda 5 questões',         description: 'Acerte 5 questões em qualquer trilha hoje',  target: 5,  xpReward: 25,  type: 'trail_answers' },
  { id: 5,  title: 'Responda 10 questões',        description: 'Acerte 10 questões em qualquer trilha hoje', target: 10, xpReward: 40,  type: 'trail_answers' },
  // Trilhas — XP
  { id: 6,  title: 'Ganhe 50 XP em trilhas',      description: 'Acumule 50 XP respondendo questões de trilha', target: 50, xpReward: 20, type: 'trail_xp' },
  { id: 7,  title: 'Ganhe 100 XP em trilhas',     description: 'Acumule 100 XP respondendo questões de trilha',target: 100,xpReward: 35, type: 'trail_xp' },
  // Trilhas — fórmulas
  { id: 8,  title: 'Acerte 3 questões de fórmula',description: 'Responda corretamente 3 questões de fórmula', target: 3, xpReward: 30,  type: 'trail_formula' },
  { id: 9,  title: 'Acerte uma questão de planilha',description: 'Complete 1 questão de planilha interativa', target: 1, xpReward: 20,  type: 'trail_formula' },
  // Trilhas — gráficos
  { id: 10, title: 'Acerte uma questão de gráfico',description: 'Responda corretamente 1 questão de gráfico', target: 1, xpReward: 20,  type: 'trail_chart' },
];

// Seleciona 4 missões do dia usando data como semente (determinístico por dia)
function selectDailyMissions(dateKey: string): MissionDef[] {
  const seed = dateKey.split('-').reduce((acc, p) => acc + parseInt(p), 0);
  const shuffled = [...MISSION_POOL].sort((a, b) => {
    const ha = ((a.id * 1337 + seed * 31) % 97);
    const hb = ((b.id * 1337 + seed * 31) % 97);
    return ha - hb;
  });
  // Sempre inclui streak + 3 aleatórias
  const streak = shuffled.find(m => m.type === 'streak')!;
  const rest = shuffled.filter(m => m.type !== 'streak').slice(0, 3);
  return [streak, ...rest];
}

@Injectable()
export class MissionsService {
  private readonly logger = new Logger(MissionsService.name);

  constructor(private prisma: PrismaService) {}

  async getDailyMissions(userId: string) {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dateKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

      // Dados de hoje
      const [user, lessonsToday, classicAnswersToday, trailAnswersToday] = await Promise.all([
        this.prisma.users.findUnique({ where: { id: userId } }),
        this.prisma.userprogress.count({
          where: { userid: userId, completedat: { gte: today } },
        }),
        this.prisma.userexerciseattempts.count({
          where: { userid: userId, attemptedat: { gte: today }, correct: true },
        }),
        this.prisma.useranswers.findMany({
          where: { userId, isCorrect: true, createdAt: { gte: today } },
          include: { question: { select: { xpReward: true, type: true } } },
        }),
      ]);

      if (!user) throw new Error('User not found');

      // Métricas de trilha de hoje
      const trailCorrectToday = trailAnswersToday.length;
      const trailXpToday = trailAnswersToday.reduce((s, a) => s + (a.question?.xpReward ?? 0), 0);
      const trailFormulaToday = trailAnswersToday.filter(
        a => a.question?.type === 'SPREADSHEET_INPUT' || a.question?.type === 'FORMULA_BUILDER'
      ).length;
      const trailChartToday = trailAnswersToday.filter(
        a => a.question?.type === 'CHART_BUILDER'
      ).length;

      const dailyXpProgress =
        lessonsToday * 10 + classicAnswersToday * 5 + trailXpToday;

      const selectedDefs = selectDailyMissions(dateKey);

      const missions = selectedDefs.map(def => {
        let progress = 0;
        switch (def.type) {
          case 'lessons':         progress = lessonsToday; break;
          case 'classic_answers': progress = classicAnswersToday; break;
          case 'streak':          progress = user.streak > 0 ? 1 : 0; break;
          case 'trail_answers':   progress = trailCorrectToday; break;
          case 'trail_xp':        progress = trailXpToday; break;
          case 'trail_formula':   progress = trailFormulaToday; break;
          case 'trail_chart':     progress = trailChartToday; break;
        }
        return {
          id: def.id,
          title: def.title,
          description: def.description,
          progress: Math.min(progress, def.target),
          target: def.target,
          xpReward: def.xpReward,
          completed: progress >= def.target,
        };
      });

      return {
        missions,
        dailyXpGoal: 100,
        dailyXpProgress,
      };
    } catch (error) {
      this.logger.error(`Get daily missions error: ${error.message}`, error.stack);
      throw error;
    }
  }
}
