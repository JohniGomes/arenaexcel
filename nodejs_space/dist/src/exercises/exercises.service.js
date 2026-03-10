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
var ExercisesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExercisesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const badges_service_1 = require("../badges/badges.service");
let ExercisesService = ExercisesService_1 = class ExercisesService {
    prisma;
    badgesService;
    logger = new common_1.Logger(ExercisesService_1.name);
    constructor(prisma, badgesService) {
        this.prisma = prisma;
        this.badgesService = badgesService;
    }
    async getExercisesByLesson(lessonId, userId) {
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
                throw new common_1.NotFoundException('Lesson not found');
            }
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
        }
        catch (error) {
            this.logger.error(`Get exercises error: ${error.message}`, error.stack);
            throw error;
        }
    }
    async submitAnswer(userId, submitAnswerDto) {
        try {
            const exercise = await this.prisma.exercises.findUnique({
                where: { id: submitAnswerDto.exerciseId },
                include: { lesson: true },
            });
            if (!exercise) {
                throw new common_1.NotFoundException('Exercise not found');
            }
            const lessonProgress = await this.prisma.userprogress.findUnique({
                where: {
                    userid_lessonid: {
                        userid: userId,
                        lessonid: exercise.lessonid,
                    },
                },
            });
            const now = new Date();
            if (lessonProgress?.canretryat && lessonProgress.status === 'incomplete') {
                if (now < lessonProgress.canretryat) {
                    const waitMinutes = Math.ceil((lessonProgress.canretryat.getTime() - now.getTime()) / 60000);
                    throw new common_1.BadRequestException(`Você errou esta questão. Aguarde ${waitMinutes} minuto(s) para tentar novamente.`);
                }
            }
            const isCorrect = exercise.correctanswer.toLowerCase().trim() === submitAnswerDto.answer.toLowerCase().trim();
            await this.prisma.userexerciseattempts.create({
                data: {
                    userid: userId,
                    exerciseid: submitAnswerDto.exerciseId,
                    answer: submitAnswerDto.answer,
                    correct: isCorrect,
                },
            });
            const user = await this.prisma.users.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new common_1.BadRequestException('User not found');
            }
            const timeDiff = now.getTime() - user.liveslastupdated.getTime();
            const minutesPassed = Math.floor(timeDiff / 60000);
            const livesToRegenerate = Math.floor(minutesPassed / 10);
            let currentLives = user.lives;
            if (livesToRegenerate > 0 && currentLives < 5) {
                currentLives = Math.min(5, currentLives + livesToRegenerate);
            }
            let livesRemaining = currentLives;
            let xpEarned = 0;
            let livesRechargeData = user.livesrechargetimes || {};
            if (isCorrect) {
                const xpByLevel = [10, 15, 20, 30, 50];
                const lessonLevelId = exercise.lesson.levelid || 1;
                xpEarned = xpByLevel[lessonLevelId - 1] || 10;
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
            }
            else {
                const isPremium = user.isPremium ?? false;
                if (!isPremium) {
                    if (currentLives <= 0) {
                        throw new common_1.BadRequestException('Você ficou sem vidas! Aguarde para que elas se recarreguem (10 minutos por vida). Seja Premium para vidas ilimitadas!');
                    }
                    livesRemaining = Math.max(0, currentLives - 1);
                    const rechargeTime = new Date(now.getTime() + 10 * 60000);
                    if (!livesRechargeData.rechargeTimes) {
                        livesRechargeData.rechargeTimes = [];
                    }
                    livesRechargeData.rechargeTimes.push(rechargeTime.toISOString());
                }
                else {
                    livesRemaining = currentLives;
                }
                xpEarned = 5;
                const retryAt = new Date(now.getTime() + 10 * 60000);
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
            let novosBadges = [];
            if (isCorrect) {
                novosBadges = await this.badgesService.verificarEConcederBadges(userId);
            }
            this.logger.log(`Exercise submitted by user ${userId}: exercise ${submitAnswerDto.exerciseId}, correct: ${isCorrect}`);
            return {
                correct: isCorrect,
                explanation: exercise.explanation,
                xpEarned,
                livesRemaining,
                canRetryAt: isCorrect ? null : new Date(now.getTime() + 10 * 60000).toISOString(),
                novosBadges: novosBadges.length > 0 ? novosBadges : undefined,
            };
        }
        catch (error) {
            this.logger.error(`Submit answer error: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.ExercisesService = ExercisesService;
exports.ExercisesService = ExercisesService = ExercisesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        badges_service_1.BadgesService])
], ExercisesService);
//# sourceMappingURL=exercises.service.js.map