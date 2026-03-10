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
var LeaderboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LeaderboardService = LeaderboardService_1 = class LeaderboardService {
    prisma;
    logger = new common_1.Logger(LeaderboardService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLeaderboard(userId, limit = 100) {
        try {
            const topUsers = await this.prisma.users.findMany({
                orderBy: { xp: 'desc' },
                take: limit,
                select: {
                    id: true,
                    name: true,
                    xp: true,
                    level: true,
                    avatar: true,
                },
            });
            const leaderboard = topUsers.map((user, index) => ({
                rank: index + 1,
                userId: user.id,
                name: user.name,
                xp: user.xp,
                level: user.level,
                avatar: user.avatar,
            }));
            const allUsers = await this.prisma.users.findMany({
                orderBy: { xp: 'desc' },
                select: { id: true },
            });
            const userRank = allUsers.findIndex(u => u.id === userId) + 1;
            return {
                leaderboard,
                userRank,
            };
        }
        catch (error) {
            this.logger.error(`Get leaderboard error: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.LeaderboardService = LeaderboardService;
exports.LeaderboardService = LeaderboardService = LeaderboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeaderboardService);
//# sourceMappingURL=leaderboard.service.js.map