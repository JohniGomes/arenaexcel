import { PrismaService } from '../prisma/prisma.service';
export declare class LeaderboardService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getLeaderboard(userId: string, limit?: number): Promise<{
        leaderboard: {
            rank: number;
            userId: string;
            name: string;
            xp: number;
            level: number;
            avatar: string | null;
        }[];
        userRank: number;
    }>;
}
