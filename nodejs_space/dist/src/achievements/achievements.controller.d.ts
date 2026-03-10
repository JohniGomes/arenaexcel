import { AchievementsService } from './achievements.service';
export declare class AchievementsController {
    private readonly achievementsService;
    constructor(achievementsService: AchievementsService);
    getAchievements(user: any): Promise<{
        achievements: {
            id: number;
            name: string;
            description: string;
            icon: string;
            unlocked: boolean;
            unlockedAt: Date | null;
            criteria: import(".prisma/client/runtime/library").JsonValue;
        }[];
        nextAchievement: {
            currentProgress: number;
            targetValue: any;
            progressPercentage: number;
            id: number;
            name: string;
            description: string;
            icon: string;
            unlocked: boolean;
            unlockedAt: Date | null;
            criteria: import(".prisma/client/runtime/library").JsonValue;
        } | null;
    }>;
}
