import { QuestionType } from '@prisma/client';
export interface QuestionSeed {
    order: number;
    type: QuestionType;
    title: string;
    description: string;
    hint?: string;
    xpReward: number;
    options?: string[];
    correctOption?: number;
    spreadsheetContext?: string;
    expectedValue?: string;
    targetCell?: string;
    correctOrder?: string[];
    explanation: string;
}
