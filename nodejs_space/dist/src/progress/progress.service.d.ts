import { PrismaService } from '../prisma/prisma.service';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class ProgressService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getProgress(userId: string): Promise<{
        levels: {
            id: number;
            name: string;
            completed: number;
            total: number;
            lessons: {
                id: number;
                title: string;
                status: string;
                exercises: number;
                canRetryAt: string | null;
            }[];
        }[];
    }>;
    updateLesson(userId: string, updateLessonDto: UpdateLessonDto): Promise<{
        xp: number;
        level: number;
        achievements: any[];
    }>;
    private checkAchievements;
}
