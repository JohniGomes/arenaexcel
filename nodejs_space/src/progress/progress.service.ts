import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const XP_THRESHOLDS = [0,100,250,450,700,1000,1350,1750,2200,2700,3250,3850,4500,5200,5950,6750,7600,8500,9500,10500];

function calculateLevel(xp: number): number {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class ProgressService {
  private readonly logger = new Logger(ProgressService.name);

  constructor(private prisma: PrismaService) {}

  async getProgress(userId: string) {
    try {
      const levels = await this.prisma.levels.findMany({
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            include: {
              userprogress: {
                where: { userid: userId },
              },
            },
          },
        },
      });

      const formattedLevels = levels.map(level => {
        const lessons = level.lessons.map(lesson => {
          const progress = lesson.userprogress[0];
          return {
            id: lesson.id,
            title: lesson.title,
            status: progress?.status || 'not_started',
            exercises: lesson.exercisescount,
            canRetryAt: progress?.canretryat ? progress.canretryat.toISOString() : null,
          };
        });

        const completedLessons = lessons.filter(l => l.status === 'completed').length;

        return {
          id: level.id,
          name: level.name,
          completed: completedLessons,
          total: lessons.length,
          lessons,
        };
      });

      return { levels: formattedLevels };
    } catch (error) {
      this.logger.error(`Get progress error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateLesson(userId: string, updateLessonDto: UpdateLessonDto) {
    try {
      const lesson = await this.prisma.lessons.findUnique({
        where: { id: updateLessonDto.lessonId },
      });

      if (!lesson) {
        throw new BadRequestException('Lesson not found');
      }

      // Update or create user progress
      await this.prisma.userprogress.upsert({
        where: {
          userid_lessonid: {
            userid: userId,
            lessonid: updateLessonDto.lessonId,
          },
        },
        update: {
          status: updateLessonDto.completed ? 'completed' : 'in_progress',
          completedat: updateLessonDto.completed ? new Date() : null,
        },
        create: {
          userid: userId,
          lessonid: updateLessonDto.lessonId,
          status: updateLessonDto.completed ? 'completed' : 'in_progress',
          completedat: updateLessonDto.completed ? new Date() : null,
        },
      });

      // Update user XP and level
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const newXp = user.xp + updateLessonDto.xpEarned;
      const newLevel = calculateLevel(newXp);

      // Update streak if lesson completed
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastStudy = user.laststudydate
        ? new Date(user.laststudydate.getFullYear(), user.laststudydate.getMonth(), user.laststudydate.getDate())
        : null;

      let newStreak = user.streak;
      if (updateLessonDto.completed) {
        if (!lastStudy) {
          newStreak = 1;
        } else {
          const daysDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff === 0) {
            // Same day, keep streak
            newStreak = user.streak;
          } else if (daysDiff === 1) {
            // Next day, increment streak
            newStreak = user.streak + 1;
          } else {
            // Missed days, reset streak
            newStreak = 1;
          }
        }
      }

      await this.prisma.users.update({
        where: { id: userId },
        data: {
          xp: newXp,
          level: newLevel,
          streak: newStreak,
          laststudydate: updateLessonDto.completed ? now : user.laststudydate,
          lastStudyAt: updateLessonDto.completed ? now : user.lastStudyAt,
        },
      });

      // Check for achievements
      const achievements = await this.checkAchievements(userId);

      this.logger.log(`Lesson progress updated for user ${userId}: lesson ${updateLessonDto.lessonId}`);

      return {
        xp: newXp,
        level: newLevel,
        achievements: achievements.map(a => a.name),
      };
    } catch (error) {
      this.logger.error(`Update lesson error: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async checkAchievements(userId: string): Promise<any[]> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        userprogress: { where: { status: 'completed' } },
        userachievements: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const allAchievements = await this.prisma.achievements.findMany();
    const unlockedAchievementIds = user.userachievements.map(ua => ua.achievementid);
    const newAchievements = [];

    for (const achievement of allAchievements) {
      if (unlockedAchievementIds.includes(achievement.id)) continue;

      let unlock = false;
      const criteria = achievement.criteria as any;

      switch (achievement.name) {
        case 'Primeira Lição':
          unlock = user.userprogress.length >= 1;
          break;
        case 'Dedicado':
          unlock = user.streak >= 7;
          break;
        case 'Persistente':
          unlock = user.streak >= 30;
          break;
        case 'Estudioso':
          unlock = user.xp >= 100;
          break;
        case 'Expert':
          unlock = user.xp >= 1000;
          break;
      }

      if (unlock) {
        await this.prisma.userachievements.create({
          data: {
            userid: userId,
            achievementid: achievement.id,
          },
        });
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }
}