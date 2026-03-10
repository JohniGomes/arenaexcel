import { PrismaService } from '../prisma/prisma.service';
export declare class AchievementsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getAchievements(userId: string): Promise<{
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
