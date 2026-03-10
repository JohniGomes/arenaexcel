"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrailsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TrailsService = class TrailsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllWithProgress(userId) {
        const trails = await this.prisma.trails.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
            include: {
                _count: { select: { questions: true } },
                userProgress: { where: { userId } },
            },
        });
        return trails.map((trail) => ({
            ...trail,
            totalQuestions: trail._count.questions,
            progress: trail.userProgress[0] ?? null,
            isUnlocked: true,
        }));
    }
    async findOneWithQuestions(slug, userId) {
        const trail = await this.prisma.trails.findUnique({
            where: { slug },
            include: {
                questions: { where: { isActive: true }, orderBy: { order: 'asc' } },
                userProgress: { where: { userId } },
            },
        });
        if (!trail)
            throw new common_1.NotFoundException('Trilha não encontrada');
        const questionsWithStatus = await Promise.all(trail.questions.map(async (q) => {
            const lastAnswer = await this.prisma.useranswers.findFirst({
                where: { userId, questionId: q.id },
                orderBy: { createdAt: 'desc' },
            });
            let status = 'available';
            let unlocksAt = null;
            if (lastAnswer) {
                if (lastAnswer.isCorrect) {
                    status = 'completed';
                }
                else {
                    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
                    if (lastAnswer.createdAt > tenMinutesAgo) {
                        status = 'locked';
                        unlocksAt = new Date(lastAnswer.createdAt.getTime() + 10 * 60 * 1000);
                    }
                    else {
                        status = 'available';
                    }
                }
            }
            return {
                ...q,
                isCompleted: status === 'completed',
                status,
                unlocksAt,
            };
        }));
        return {
            ...trail,
            questions: questionsWithStatus,
        };
    }
    async getQuestion(slug, order, userId) {
        const trail = await this.prisma.trails.findUnique({ where: { slug } });
        if (!trail)
            throw new common_1.NotFoundException('Trilha não encontrada');
        const question = await this.prisma.questions.findUnique({
            where: { trailId_order: { trailId: trail.id, order } },
        });
        if (!question)
            throw new common_1.NotFoundException('Questão não encontrada');
        const correctOrder = question.correctOrder
            ? JSON.parse(question.correctOrder)
            : null;
        const shuffledItems = correctOrder && question.type === 'DRAG_AND_DROP'
            ? this.shuffleArray([...correctOrder])
            : null;
        return {
            ...question,
            options: question.options ? JSON.parse(question.options) : null,
            spreadsheetContext: question.spreadsheetContext
                ? JSON.parse(question.spreadsheetContext)
                : null,
            correctOrder: shuffledItems,
            correctOption: undefined,
            expectedValue: undefined,
        };
    }
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    async submitAnswer(userId, questionId, value, timeSpentMs) {
        const question = await this.prisma.questions.findUnique({
            where: { id: questionId },
            include: { trail: true },
        });
        if (!question)
            throw new common_1.NotFoundException('Questão não encontrada');
        const isCorrect = this.checkAnswer(question, value);
        await this.prisma.useranswers.create({
            data: { userId, questionId, value, isCorrect, timeSpentMs },
        });
        if (isCorrect) {
            await this.prisma.users.update({
                where: { id: userId },
                data: { xp: { increment: question.xpReward } },
            });
            const totalQuestionsInTrail = await this.prisma.questions.count({
                where: { trailId: question.trailId, isActive: true },
            });
            const isLastQuestion = question.order >= totalQuestionsInTrail;
            await this.prisma.usertrailprogress.upsert({
                where: {
                    userId_trailId: { userId, trailId: question.trailId },
                },
                create: {
                    userId,
                    trailId: question.trailId,
                    currentQuestion: question.order,
                    xpEarned: question.xpReward,
                    completedAt: isLastQuestion ? new Date() : null,
                },
                update: {
                    currentQuestion: { set: Math.max(question.order, 0) },
                    xpEarned: { increment: question.xpReward },
                    completedAt: isLastQuestion ? new Date() : undefined,
                },
            });
        }
        return {
            isCorrect,
            explanation: question.explanation,
            xpEarned: isCorrect ? question.xpReward : 0,
        };
    }
    checkAnswer(question, value) {
        const normalize = (s) => s?.trim().toUpperCase().replace(/\s+/g, '').replace(/;/g, ',') ?? '';
        switch (question.type) {
            case 'MULTIPLE_CHOICE':
                return parseInt(value) === question.correctOption;
            case 'SPREADSHEET_INPUT':
            case 'FORMULA_BUILDER':
                const userAnswer = normalize(value);
                const expectedAnswer = normalize(question.expectedValue ?? '');
                const alternativeAnswers = question.alternativeAnswers
                    ? JSON.parse(question.alternativeAnswers).map((a) => normalize(a))
                    : [];
                if (userAnswer === expectedAnswer)
                    return true;
                if (alternativeAnswers.includes(userAnswer))
                    return true;
                return this.checkFormulaEquivalence(userAnswer, expectedAnswer, alternativeAnswers);
            case 'CHART_BUILDER':
                return normalize(value) === normalize(question.expectedValue ?? '');
            case 'DRAG_AND_DROP':
                try {
                    const correctOrder = question.correctOrder
                        ? JSON.parse(question.correctOrder)
                        : [];
                    const userOrder = JSON.parse(value);
                    return JSON.stringify(correctOrder) === JSON.stringify(userOrder);
                }
                catch {
                    return false;
                }
            default:
                return false;
        }
    }
    checkFormulaEquivalence(userAnswer, expectedAnswer, alternativeAnswers) {
        if (alternativeAnswers.length > 0 && alternativeAnswers.includes(userAnswer)) {
            return true;
        }
        const equivalentPairs = [
            ['=A1+B1', '=SOMA(A1,B1)', '=SOMA(A1:B1)', '=SUM(A1,B1)', '=SUM(A1:B1)'],
            ['=A1*B1', '=PRODUTO(A1,B1)', '=PRODUCT(A1,B1)'],
            ['=A1*B1*C1', '=PRODUTO(A1,B1,C1)', '=PRODUTO(A1:C1)', '=PRODUCT(A1,B1,C1)'],
            ['=SOMA(', '=SUM('],
            ['=MÉDIA(', '=AVERAGE('],
            ['=CONT.', '=COUNT'],
            ['=SE(', '=IF('],
            ['=SOMASE(', '=SUMIF('],
            ['=PROCV(', '=VLOOKUP('],
            ['=PROCX(', '=XLOOKUP('],
            ['=PGTO(', '=PMT('],
        ];
        for (const group of equivalentPairs) {
            if (group.includes(userAnswer) && group.includes(expectedAnswer)) {
                return true;
            }
        }
        let translatedUser = userAnswer;
        let translatedExpected = expectedAnswer;
        const translations = [
            ['=SOMA(', '=SUM('],
            ['=MÉDIA(', '=AVERAGE('],
            ['=SE(', '=IF('],
            ['=SOMASE(', '=SUMIF('],
            ['=CONT.SE(', '=COUNTIF('],
            ['=PROCV(', '=VLOOKUP('],
            ['=PROCX(', '=XLOOKUP('],
            ['=PGTO(', '=PMT('],
            ['=MAIOR(', '=LARGE('],
            ['=MENOR(', '=SMALL('],
        ];
        for (const [ptBR, en] of translations) {
            translatedUser = translatedUser.replace(ptBR, en);
            translatedExpected = translatedExpected.replace(ptBR, en);
        }
        return translatedUser === translatedExpected;
    }
    isTrailUnlocked(order, trails, userId) {
        const prev = trails.find((t) => t.order === order - 1);
        if (!prev)
            return true;
        return prev.userProgress?.[0]?.completedAt != null;
    }
};
exports.TrailsService = TrailsService;
exports.TrailsService = TrailsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TrailsService);
//# sourceMappingURL=trails.service.js.map