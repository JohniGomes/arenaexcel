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
var MissionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MissionsService = MissionsService_1 = class MissionsService {
    prisma;
    logger = new common_1.Logger(MissionsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDailyMissions(userId) {
        try {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
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
            const lessonsCompletedToday = user.userprogress.length;
            const correctAnswersToday = user.userexerciseattempts.length;
            const dailyXpProgress = lessonsCompletedToday * 10 + correctAnswersToday * 10;
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
        }
        catch (error) {
            this.logger.error(`Get daily missions error: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.MissionsService = MissionsService;
exports.MissionsService = MissionsService = MissionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MissionsService);
//# sourceMappingURL=missions.service.js.map