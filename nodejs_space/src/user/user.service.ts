import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SaveOnboardingDto } from './dto/save-onboarding.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
        include: {
          userprogress: {
            where: { status: 'completed' },
          },
          userexerciseattempts: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Calculate stats
      const lessonsCompleted = user.userprogress.length;
      const totalAttempts = user.userexerciseattempts.length;
      const correctAttempts = user.userexerciseattempts.filter(a => a.correct).length;
      const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
      const studyHours = Math.floor(lessonsCompleted * 0.5); // Estimate 30 min per lesson

      // Regenerate lives if needed - 1 life every 10 minutes
      const now = new Date();
      const lastUpdated = user.liveslastupdated;
      const timeDiff = now.getTime() - lastUpdated.getTime();
      const minutesPassed = Math.floor(timeDiff / 60000);
      const livesToRegenerate = Math.floor(minutesPassed / 10); // 1 life every 10 minutes

      let currentLives = user.lives;
      let livesRechargeTimesData = user.livesrechargetimes as any || {};
      
      if (livesToRegenerate > 0 && currentLives < 5) {
        currentLives = Math.min(5, currentLives + livesToRegenerate);
        
        // Clear old recharge times when lives are full
        if (currentLives >= 5) {
          livesRechargeTimesData = {};
        }
        
        await this.prisma.users.update({
          where: { id: userId },
          data: {
            lives: currentLives,
            liveslastupdated: now,
            livesrechargetimes: livesRechargeTimesData,
          },
        });
      }
      
      // Calculate next recharge time
      let nextRechargeTime = null;
      if (currentLives < 5) {
        const nextRechargeMinutes = 10 - (minutesPassed % 10);
        nextRechargeTime = new Date(now.getTime() + nextRechargeMinutes * 60000);
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        lives: currentLives,
        nextRechargeTime,
        avatar: user.avatar,
        profilePicture: user.profilepicture,
        onboardingCompleted: user.onboardingCompleted,
        isPremium: user.isPremium,
        stats: {
          lessonsCompleted,
          accuracy: Math.round(accuracy),
          studyHours,
        },
      };
    } catch (error) {
      this.logger.error(`Get profile error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    try {
      const user = await this.prisma.users.update({
        where: { id: userId },
        data: {
          ...(updateProfileDto.name && { name: updateProfileDto.name }),
          ...(updateProfileDto.avatar && { avatar: updateProfileDto.avatar }),
        },
      });

      this.logger.log(`Profile updated for user: ${userId}`);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          level: user.level,
          xp: user.xp,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      this.logger.error(`Update profile error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async saveOnboarding(userId: string, saveOnboardingDto: SaveOnboardingDto) {
    try {
      await this.prisma.users.update({
        where: { id: userId },
        data: {
          onboardingCompleted: true,
          onboardingLevel: saveOnboardingDto.level,
          onboardingGoals: saveOnboardingDto.goals,
          onboardingStudyTime: saveOnboardingDto.studyTime,
          onboardingArea: saveOnboardingDto.area,
          onboardingChallenges: saveOnboardingDto.challenges,
        },
      });

      this.logger.log(`Onboarding saved for user: ${userId}`);

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(`Save onboarding error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async selectMascot(userId: string, mascotId: string) {
    try {
      // Validate mascot ID
      const validMascots = ['mago', 'mestre', 'verde', 'sir', 'ninj', 'orbit'];
      if (!validMascots.includes(mascotId)) {
        throw new Error('Invalid mascot selection');
      }

      const user = await this.prisma.users.update({
        where: { id: userId },
        data: {
          profilepicture: mascotId,
        },
      });

      this.logger.log(`Mascot selected for user: ${userId} - ${mascotId}`);

      return {
        mascotId: user.profilepicture,
        message: 'Mascote selecionado com sucesso',
      };
    } catch (error) {
      this.logger.error(`Select mascot error: ${error.message}`, error.stack);
      throw error;
    }
  }
}