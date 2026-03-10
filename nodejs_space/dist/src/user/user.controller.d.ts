import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SaveOnboardingDto } from './dto/save-onboarding.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(user: any): Promise<{
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
    updateProfile(user: any, updateProfileDto: UpdateProfileDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            level: number;
            xp: number;
            avatar: string | null;
        };
    }>;
    saveOnboarding(user: any, saveOnboardingDto: SaveOnboardingDto): Promise<{
        success: boolean;
    }>;
    selectMascot(user: any, mascotId: string): Promise<{
        mascotId: string | null;
        message: string;
    }>;
}
