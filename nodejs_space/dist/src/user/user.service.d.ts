import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SaveOnboardingDto } from './dto/save-onboarding.dto';
export declare class UserService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        level: number;
        xp: number;
        streak: number;
        lives: number;
        nextRechargeTime: Date | null;
        avatar: string | null;
        profilePicture: string | null;
        onboardingCompleted: boolean;
        isPremium: boolean;
        stats: {
            lessonsCompleted: number;
            accuracy: number;
            studyHours: number;
        };
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            level: number;
            xp: number;
            avatar: string | null;
        };
    }>;
    saveOnboarding(userId: string, saveOnboardingDto: SaveOnboardingDto): Promise<{
        success: boolean;
    }>;
    selectMascot(userId: string, mascotId: string): Promise<{
        mascotId: string | null;
        message: string;
    }>;
}
