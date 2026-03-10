import { MissionsService } from './missions.service';
export declare class MissionsController {
    private readonly missionsService;
    constructor(missionsService: MissionsService);
    getDailyMissions(user: any): Promise<{
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
