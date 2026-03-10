import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private prisma;
    private readonly logger;
    private expo;
    constructor(prisma: PrismaService);
    private initializeExpo;
    savePushToken(userId: string, token: string): Promise<void>;
    sendToUser(userId: string, title: string, body: string, data?: Record<string, unknown>): Promise<void>;
    checkInactiveUsers(): Promise<void>;
    checkStreakAtRisk(): Promise<void>;
    sendMorningMotivation(): Promise<void>;
    sendDailyTip(): Promise<void>;
}
