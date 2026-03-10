import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(private prisma: PrismaService) {}

  async getLeaderboard(userId: string, limit: number = 100) {
    try {
      // Get top users by XP
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

      // Find current user's rank
      const allUsers = await this.prisma.users.findMany({
        orderBy: { xp: 'desc' },
        select: { id: true },
      });

      const userRank = allUsers.findIndex(u => u.id === userId) + 1;

      return {
        leaderboard,
        userRank,
      };
    } catch (error) {
      this.logger.error(`Get leaderboard error: ${error.message}`, error.stack);
      throw error;
    }
  }
}