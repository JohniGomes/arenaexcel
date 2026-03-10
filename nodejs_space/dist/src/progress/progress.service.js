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
var ProgressService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProgressService = ProgressService_1 = class ProgressService {
    prisma;
    logger = new common_1.Logger(ProgressService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProgress(userId) {
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
        }
        catch (error) {
            this.logger.error(`Get progress error: ${error.message}`, error.stack);
            throw error;
        }
    }
    async updateLesson(userId, updateLessonDto) {
        try {
            const lesson = await this.prisma.lessons.findUnique({
                where: { id: updateLessonDto.lessonId },
            });
            if (!lesson) {
                throw new common_1.BadRequestException('Lesson not found');
            }
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
            const user = await this.prisma.users.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new Error('User not found');
            }
            const newXp = user.xp + updateLessonDto.xpEarned;
            let newLevel = user.level;
            if (newXp >= 1000)
                newLevel = 5;
            else if (newXp >= 600)
                newLevel = 4;
            else if (newXp >= 300)
                newLevel = 3;
            else if (newXp >= 100)
                newLevel = 2;
            else
                newLevel = 1;
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const lastStudy = user.laststudydate
                ? new Date(user.laststudydate.getFullYear(), user.laststudydate.getMonth(), user.laststudydate.getDate())
                : null;
            let newStreak = user.streak;
            if (updateLessonDto.completed) {
                if (!lastStudy) {
                    newStreak = 1;
                }
                else {
                    const daysDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
                    if (daysDiff === 0) {
                        newStreak = user.streak;
                    }
                    else if (daysDiff === 1) {
                        newStreak = user.streak + 1;
                    }
                    else {
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
            const achievements = await this.checkAchievements(userId);
            this.logger.log(`Lesson progress updated for user ${userId}: lesson ${updateLessonDto.lessonId}`);
            return {
                xp: newXp,
                level: newLevel,
                achievements: achievements.map(a => a.name),
            };
        }
        catch (error) {
            this.logger.error(`Update lesson error: ${error.message}`, error.stack);
            throw error;
        }
    }
    async checkAchievements(userId) {
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
            if (unlockedAchievementIds.includes(achievement.id))
                continue;
            let unlock = false;
            const criteria = achievement.criteria;
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
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = ProgressService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map