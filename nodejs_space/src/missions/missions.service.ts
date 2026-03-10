import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MissionsService {
  private readonly logger = new Logger(MissionsService.name);

  constructor(private prisma: PrismaService) {}

  async getDailyMissions(userId: string) {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Get user data for mission calculations
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
        include: {
          userprogress: {
            where: {
              completedat: {
                gte: today,
              },
            },
          },
          userexerciseattempts: {
            where: {
              attemptedat: {
                gte: today,
              },
              correct: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Calculate daily progress
      const lessonsCompletedToday = user.userprogress.length;
      const correctAnswersToday = user.userexerciseattempts.length;
      const dailyXpProgress = lessonsCompletedToday * 10 + correctAnswersToday * 10;

      // Define daily missions
      const missions = [
        {
          id: 1,
          title: 'Complete 3 lições',
          description: 'Conclua 3 lições hoje',
          progress: lessonsCompletedToday,
          target: 3,
          xpReward: 30,
          completed: lessonsCompletedToday >= 3,
        },
        {
          id: 2,
          title: 'Acerte 10 questões',
          description: 'Responda corretamente 10 exercícios',
          progress: correctAnswersToday,
          target: 10,
          xpReward: 20,
          completed: correctAnswersToday >= 10,
        },
        {
          id: 3,
          title: 'Mantenha o streak',
          description: 'Estude por pelo menos 1 dia seguido',
          progress: user.streak > 0 ? 1 : 0,
          target: 1,
          xpReward: 15,
          completed: user.streak > 0,
        },
      ];

      return {
        missions,
        dailyXpGoal: 65,
        dailyXpProgress,
      };
    } catch (error) {
      this.logger.error(`Get daily missions error: ${error.message}`, error.stack);
      throw error;
    }
  }
}