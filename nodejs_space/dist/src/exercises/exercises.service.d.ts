import { PrismaService } from '../prisma/prisma.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { BadgesService } from '../badges/badges.service';
export declare class ExercisesService {
    private prisma;
    private badgesService;
    private readonly logger;
    constructor(prisma: PrismaService, badgesService: BadgesService);
    getExercisesByLesson(lessonId: number, userId?: string): Promise<{
        exercises: {
            id: number;
            type: string;
            question: string;
            options: import(".prisma/client/runtime/library").JsonValue;
            imageUrl: string | null;
            hint: string | null;
        }[];
        lessonStatus: string;
        canRetryAt: string | null;
    }>;
    submitAnswer(userId: string, submitAnswerDto: SubmitAnswerDto): Promise<{
        correct: boolean;
        explanation: string;
        xpEarned: number;
        livesRemaining: number;
        canRetryAt: string | null;
        novosBadges: string[] | undefined;
    }>;
}
