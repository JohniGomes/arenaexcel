import { ExercisesService } from './exercises.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
export declare class ExercisesController {
    private readonly exercisesService;
    constructor(exercisesService: ExercisesService);
    getExercisesByLesson(lessonId: number, user: any): Promise<{
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
    submitAnswer(user: any, submitAnswerDto: SubmitAnswerDto): Promise<{
        correct: boolean;
        explanation: string;
        xpEarned: number;
        livesRemaining: number;
        canRetryAt: string | null;
        novosBadges: string[] | undefined;
    }>;
}
