import { TrailsService } from './trails.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
export declare class TrailsController {
    private readonly trailsService;
    constructor(trailsService: TrailsService);
    findAll(user: any): Promise<{
        totalQuestions: number;
        progress: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            trailId: string;
            userId: string;
            currentQuestion: number;
            completedAt: Date | null;
            xpEarned: number;
            accuracy: number;
        };
        isUnlocked: boolean;
        userProgress: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            trailId: string;
            userId: string;
            currentQuestion: number;
            completedAt: Date | null;
            xpEarned: number;
            accuracy: number;
        }[];
        _count: {
            questions: number;
        };
        slug: string;
        id: string;
        name: string;
        icon: string;
        description: string;
        profession: import("@prisma/client").$Enums.TrailProfession;
        order: number;
        color: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(slug: string, user: any): Promise<{
        questions: {
            isCompleted: boolean;
            status: string;
            unlocksAt: Date | null;
            id: string;
            description: string;
            order: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            trailId: string;
            type: import("@prisma/client").$Enums.QuestionType;
            title: string;
            hint: string | null;
            xpReward: number;
            options: string | null;
            correctOption: number | null;
            spreadsheetContext: string | null;
            expectedValue: string | null;
            targetCell: string | null;
            correctOrder: string | null;
            explanation: string;
        }[];
        userProgress: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            trailId: string;
            userId: string;
            currentQuestion: number;
            completedAt: Date | null;
            xpEarned: number;
            accuracy: number;
        }[];
        slug: string;
        id: string;
        name: string;
        icon: string;
        description: string;
        profession: import("@prisma/client").$Enums.TrailProfession;
        order: number;
        color: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getQuestion(slug: string, order: string, user: any): Promise<{
        options: any;
        spreadsheetContext: any;
        correctOrder: any[] | null;
        correctOption: undefined;
        expectedValue: undefined;
        id: string;
        description: string;
        order: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        trailId: string;
        type: import("@prisma/client").$Enums.QuestionType;
        title: string;
        hint: string | null;
        xpReward: number;
        targetCell: string | null;
        explanation: string;
    }>;
    submitAnswer(user: any, dto: SubmitAnswerDto): Promise<{
        isCorrect: boolean;
        explanation: string;
        xpEarned: number;
    }>;
}
