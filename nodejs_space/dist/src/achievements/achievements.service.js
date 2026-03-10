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
var AchievementsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AchievementsService = AchievementsService_1 = class AchievementsService {
    prisma;
    logger = new common_1.Logger(AchievementsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAchievements(userId) {
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
            let nextAchievement = null;
            for (const achievement of achievements) {
                if (!achievement.unlocked) {
                    const criteria = achievement.criteria;
                    let currentProgress = 0;
                    let targetValue = criteria?.value || 1;
                    if (criteria?.type === 'lessons_completed') {
                        currentProgress = user?.userprogress?.length || 0;
                    }
                    else if (criteria?.type === 'streak') {
                        currentProgress = user?.streak || 0;
                    }
                    else if (criteria?.type === 'xp') {
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
        }
        catch (error) {
            this.logger.error(`Get achievements error: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.AchievementsService = AchievementsService;
exports.AchievementsService = AchievementsService = AchievementsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AchievementsService);
//# sourceMappingURL=achievements.service.js.map