import { LeaderboardService } from './leaderboard.service';
export declare class LeaderboardController {
    private readonly leaderboardService;
    constructor(leaderboardService: LeaderboardService);
    getLeaderboard(user: any, limit: number): Promise<{
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
