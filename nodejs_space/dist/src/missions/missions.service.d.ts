import { PrismaService } from '../prisma/prisma.service';
export declare class MissionsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getDailyMissions(userId: string): Promise<{
        missions: {
            id: number;
            title: string;
            description: string;
            progress: number;
            target: number;
            xpReward: number;
            completed: boolean;
        }[];
        dailyXpGoal: number;
        dailyXpProgress: number;
    }>;
}
