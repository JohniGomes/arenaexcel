import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { BadgesService } from '../badges/badges.service';

@Injectable()
export class ExercisesService {
  private readonly logger = new Logger(ExercisesService.name);

  constructor(
    private prisma: PrismaService,
    private badgesService: BadgesService,
  ) {}

  async getExercisesByLesson(lessonId: number, userId?: string) {
    try {
      const lesson = await this.prisma.lessons.findUnique({
        where: { id: lessonId },
        include: {
          exercises: {
            orderBy: { order: 'asc' },
          },
          userprogress: userId ? {
            where: { userid: userId },
          } : false,
        },
      });

      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }

      // Get lesson status (completed, incomplete, or not_started)
      let lessonStatus = 'not_started';
      let canRetryAt = null;
      
      if (userId && lesson.userprogress && lesson.userprogress.length > 0) {
        const progress = lesson.userprogress[0];
        lessonStatus = progress.status;
        canRetryAt = progress.canretryat;
      }

      const exercises = lesson.exercises.map(ex => ({
        id: ex.id,
        type: ex.type,
        question: ex.question,
        options: ex.options,
        imageUrl: ex.imageUrl,
        hint: ex.hint,
      }));

      return { 
        exercises,
        lessonStatus,
        canRetryAt: canRetryAt ? canRetryAt.toISOString() : null,
      };
    } catch (error) {
      this.logger.error(`Get exercises error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async submitAnswer(userId: string, submitAnswerDto: SubmitAnswerDto) {
    try {
      const exercise = await this.prisma.exercises.findUnique({
        where: { id: submitAnswerDto.exerciseId },
        include: { lesson: true },
      });

      if (!exercise) {
        throw new NotFoundException('Exercise not found');
      }

      // Get lesson progress to check retry cooldown
      const lessonProgress = await this.prisma.userprogress.findUnique({
        where: {
          userid_lessonid: {
            userid: userId,
            lessonid: exercise.lessonid,
          },
        },
      });

      // Block re-submission of already completed lessons (anti-XP farm)
      if (lessonProgress?.status === 'completed') {
        throw new BadRequestException('Esta lição já foi concluída!');
      }

      // Check if user can retry (if they failed before)
      const now = new Date();
      if (lessonProgress?.canretryat && lessonProgress.status === 'incomplete') {
        if (now < lessonProgress.canretryat) {
          const waitMinutes = Math.ceil((lessonProgress.canretryat.getTime() - now.getTime()) / 60000);
          throw new BadRequestException(`Você errou esta questão. Aguarde ${waitMinutes} minuto(s) para tentar novamente.`);
        }
      }

      // Check if answer is correct (case-insensitive)
      const isCorrect = exercise.correctanswer.toLowerCase().trim() === submitAnswerDto.answer.toLowerCase().trim();

      // Save attempt
      await this.prisma.userexerciseattempts.create({
        data: {
          userid: userId,
          exerciseid: submitAnswerDto.exerciseId,
          answer: submitAnswerDto.answer,
          correct: isCorrect,
        },
      });

      // Update lives and XP
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Regenerate lives based on time passed
      const timeDiff = now.getTime() - user.liveslastupdated.getTime();
      const minutesPassed = Math.floor(timeDiff / 60000);
      const livesToRegenerate = Math.floor(minutesPassed / 10); // 1 life every 10 minutes

      let currentLives = user.lives;
      if (livesToRegenerate > 0 && currentLives < 5) {
        currentLives = Math.min(5, currentLives + livesToRegenerate);
      }

      let livesRemaining = currentLives;
      let xpEarned = 0;
      let livesRechargeData = user.livesrechargetimes as any || {};

      if (isCorrect) {
        // XP increases with level: Level 1 = 10XP, Level 2 = 15XP, Level 3 = 20XP, Level 4 = 30XP, Level 5 = 50XP
        const xpByLevel = [10, 15, 20, 30, 50];
        const lessonLevelId = exercise.lesson.levelid || 1;
        xpEarned = xpByLevel[lessonLevelId - 1] || 10;
        
        // Update lesson progress to completed
        await this.prisma.userprogress.upsert({
          where: {
            userid_lessonid: {
              userid: userId,
              lessonid: exercise.lessonid,
            },
          },
          create: {
            userid: userId,
            lessonid: exercise.lessonid,
            status: 'completed',
            completedat: now,
            accuracy: 100,
            lastfailedattempt: null,
            canretryat: null,
          },
          update: {
            status: 'completed',
            completedat: now,
            accuracy: 100,
            lastfailedattempt: null,
            canretryat: null,
          },
        });
      } else {
        // Premium users have unlimited lives
        const isPremium = (user as any).isPremium ?? false;

        if (!isPremium) {
          // Check if user has lives before deducting
          if (currentLives <= 0) {
            throw new BadRequestException('Você ficou sem vidas! Aguarde para que elas se recarreguem (10 minutos por vida). Seja Premium para vidas ilimitadas!');
          }
          
          // Deduct a life and record recharge time
          livesRemaining = Math.max(0, currentLives - 1);
          
          // Store recharge time for this life
          const rechargeTime = new Date(now.getTime() + 10 * 60000); // 10 minutes from now
          if (!livesRechargeData.rechargeTimes) {
            livesRechargeData.rechargeTimes = [];
          }
          livesRechargeData.rechargeTimes.push(rechargeTime.toISOString());
        } else {
          // Premium users don't lose lives
          livesRemaining = currentLives;
        }

        xpEarned = 5; // Partial XP for attempting
        
        // Update lesson progress to incomplete with retry cooldown
        const retryAt = new Date(now.getTime() + 10 * 60000); // Can retry in 10 minutes
        await this.prisma.userprogress.upsert({
          where: {
            userid_lessonid: {
              userid: userId,
              lessonid: exercise.lessonid,
            },
          },
          create: {
            userid: userId,
            lessonid: exercise.lessonid,
            status: 'incomplete',
            lastfailedattempt: now,
            canretryat: retryAt,
          },
          update: {
            status: 'incomplete',
            lastfailedattempt: now,
            canretryat: retryAt,
          },
        });
      }

      // Update user
      await this.prisma.users.update({
        where: { id: userId },
        data: {
          lives: livesRemaining,
          xp: user.xp + xpEarned,
          liveslastupdated: !isCorrect ? now : (livesToRegenerate > 0 ? now : user.liveslastupdated),
          livesrechargetimes: !isCorrect ? livesRechargeData : (livesToRegenerate > 0 ? {} : user.livesrechargetimes),
          totalExercicios: isCorrect ? { increment: 1 } : undefined,
        },
      });

      // Verificar e conceder badges se acertou
      let novosBadges: string[] = [];
      if (isCorrect) {
        novosBadges = await this.badgesService.verificarEConcederBadges(userId);
      }

      this.logger.log(`Exercise submitted by user ${userId}: exercise ${submitAnswerDto.exerciseId}, correct: ${isCorrect}`);

      return {
        correct: isCorrect,
        explanation: exercise.explanation,
        correctAnswer: exercise.correctanswer,
        xpEarned,
        livesRemaining,
        canRetryAt: isCorrect ? null : new Date(now.getTime() + 10 * 60000).toISOString(),
        novosBadges: novosBadges.length > 0 ? novosBadges : undefined,
      };
    } catch (error) {
      this.logger.error(`Submit answer error: ${error.message}`, error.stack);
      throw error;
    }
  }
}