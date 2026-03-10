import { ProgressService } from './progress.service';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    getProgress(user: any): Promise<{
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
    updateLesson(user: any, updateLessonDto: UpdateLessonDto): Promise<{
        xp: number;
        level: number;
        achievements: any[];
    }>;
}
