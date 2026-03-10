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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = UserService_1 = class UserService {
    prisma;
    logger = new common_1.Logger(UserService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
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
                throw new common_1.NotFoundException('User not found');
            }
            const lessonsCompleted = user.userprogress.length;
            const totalAttempts = user.userexerciseattempts.length;
            const correctAttempts = user.userexerciseattempts.filter(a => a.correct).length;
            const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
            const studyHours = Math.floor(lessonsCompleted * 0.5);
            const now = new Date();
            const lastUpdated = user.liveslastupdated;
            const timeDiff = now.getTime() - lastUpdated.getTime();
            const minutesPassed = Math.floor(timeDiff / 60000);
            const livesToRegenerate = Math.floor(minutesPassed / 10);
            let currentLives = user.lives;
            let livesRechargeTimesData = user.livesrechargetimes || {};
            if (livesToRegenerate > 0 && currentLives < 5) {
                currentLives = Math.min(5, currentLives + livesToRegenerate);
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
        }
        catch (error) {
            this.logger.error(`Get profile error: ${error.message}`, error.stack);
            throw error;
        }
    }
    async updateProfile(userId, updateProfileDto) {
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
        }
        catch (error) {
            this.logger.error(`Update profile error: ${error.message}`, error.stack);
            throw error;
        }
    }
    async saveOnboarding(userId, saveOnboardingDto) {
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
        }
        catch (error) {
            this.logger.error(`Save onboarding error: ${error.message}`, error.stack);
            throw error;
        }
    }
    async selectMascot(userId, mascotId) {
        try {
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
        }
        catch (error) {
            this.logger.error(`Select mascot error: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map