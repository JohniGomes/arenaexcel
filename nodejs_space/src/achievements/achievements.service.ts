import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AchievementsService {
  private readonly logger = new Logger(AchievementsService.name);

  constructor(private prisma: PrismaService) {}

  async getAchievements(userId: string) {
    try {
      const allAchievements = await this.prisma.achievements.findMany({
        orderBy: { id: 'asc' },
      });

      const userAchievements = await this.prisma.userachievements.findMany({
        where: { userid: userId },
        include: { achievement: true },
      });

      const user = await this.prisma.users.findUnique({
        where: { id: userId },
        include: {
          userprogress: {
            where: { status: 'completed' },
          },
        },
      });

      const unlockedAchievementIds = new Set(userAchievements.map(ua => ua.achievementid));

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
          let currentProgress = 0;
          let targetValue = criteria?.value || 1;

          if (criteria?.type === 'lessons_completed') {
            currentProgress = user?.userprogress?.length || 0;
          } else if (criteria?.type === 'streak') {
            currentProgress = user?.streak || 0;
          } else if (criteria?.type === 'xp') {
            currentProgress = user?.xp || 0;
          }

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