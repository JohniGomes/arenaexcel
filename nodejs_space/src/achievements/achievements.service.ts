import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AchievementsService {
  private readonly logger = new Logger(AchievementsService.name);

  constructor(private prisma: PrismaService) {}

  async getAchievements(userId: string) {
    try {
      const [allAchievements, userAchievements, user, trailProgress, trailAnswers] = await Promise.all([
        this.prisma.achievements.findMany({ orderBy: { id: 'asc' } }),
        this.prisma.userachievements.findMany({ where: { userid: userId }, include: { achievement: true } }),
        this.prisma.users.findUnique({
          where: { id: userId },
          include: {
            userprogress: { where: { status: 'completed' } },
            useranswers: { include: { question: { select: { type: true } } } },
          },
        }),
        this.prisma.usertrailprogress.findMany({ where: { userId } }),
        this.prisma.useranswers.findMany({ where: { userId, isCorrect: true }, include: { question: { select: { type: true } } } }),
      ]);

      const unlockedAchievementIds = new Set(userAchievements.map(ua => ua.achievementid));
      const trailsCompleted = trailProgress.filter(tp => tp.completedAt !== null).length;
      const formulaCorrect = trailAnswers.filter(a =>
        a.question?.type === 'SPREADSHEET_INPUT' || a.question?.type === 'FORMULA_BUILDER'
      ).length;
      const chartCorrect = trailAnswers.filter(a => a.question?.type === 'CHART_BUILDER').length;

      const getProgress = (criteria: any): number => {
        const type = criteria?.type;
        switch (type) {
          case 'lessons_completed': return user?.userprogress?.length || 0;
          case 'streak': return user?.streak || 0;
          case 'xp': return user?.xp || 0;
          case 'level': return user?.level || 1;
          case 'trails_completed': return trailsCompleted;
          case 'trail_questions': return trailAnswers.length;
          case 'formula_correct': return formulaCorrect;
          case 'chart_correct': return chartCorrect;
          default: return 0;
        }
      };

      const achievements = allAchievements.map(achievement => {
        const userAchievement = userAchievements.find(ua => ua.achievementid === achievement.id);
        return {
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          unlocked: unlockedAchievementIds.has(achievement.id),
          unlockedAt: userAchievement?.unlockedat || null,
          criteria: achievement.criteria,
        };
      });

      // Find next achievement and calculate progress
      let nextAchievement = null;
      for (const achievement of achievements) {
        if (!achievement.unlocked) {
          const criteria = achievement.criteria as any;
          const currentProgress = getProgress(criteria);
          const targetValue = criteria?.value || 1;
          nextAchievement = {
            ...achievement,
            currentProgress,
            targetValue,
            progressPercentage: Math.min(100, Math.round((currentProgress / targetValue) * 100)),
          };
          break;
        }
      }

      return { achievements, nextAchievement };
    } catch (error) {
      this.logger.error(`Get achievements error: ${error.message}`, error.stack);
      throw error;
    }
  }
}