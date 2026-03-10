import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrailsService {
  constructor(private prisma: PrismaService) {}

  async findAllWithProgress(userId: string) {
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
      // TEMPORÁRIO: Todas as trilhas liberadas para testes
      isUnlocked: true,
      // SISTEMA DE BLOQUEIO (desabilitado temporariamente):
      // isUnlocked: trail.order === 1 || this.isTrailUnlocked(trail.order, trails, userId),
    }));
  }

  async findOneWithQuestions(slug: string, userId: string) {
    const trail = await this.prisma.trails.findUnique({
      where: { slug },
      include: {
        questions: { where: { isActive: true }, orderBy: { order: 'asc' } },
        userProgress: { where: { userId } },
      },
    });
    if (!trail) throw new NotFoundException('Trilha não encontrada');

    // Para cada questão, busca o status baseado nas respostas do usuário
    const questionsWithStatus = await Promise.all(
      trail.questions.map(async (q) => {
        const lastAnswer = await this.prisma.useranswers.findFirst({
          where: { userId, questionId: q.id },
          orderBy: { createdAt: 'desc' },
        });

        let status = 'available';
        let unlocksAt = null;

        if (lastAnswer) {
          if (lastAnswer.isCorrect) {
            status = 'completed';
          } else {
            // Errou: verifica se já passaram 10 minutos
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            if (lastAnswer.createdAt > tenMinutesAgo) {
              status = 'locked';
              unlocksAt = new Date(lastAnswer.createdAt.getTime() + 10 * 60 * 1000);
            } else {
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
      }),
    );

    return {
      ...trail,
      questions: questionsWithStatus,
    };
  }

  async getQuestion(slug: string, order: number, userId: string) {
    const trail = await this.prisma.trails.findUnique({ where: { slug } });
    if (!trail) throw new NotFoundException('Trilha não encontrada');

    const question = await this.prisma.questions.findUnique({
      where: { trailId_order: { trailId: trail.id, order } },
    });
    if (!question) throw new NotFoundException('Questão não encontrada');

    // Deserializa JSON fields
    const correctOrder = question.correctOrder
      ? JSON.parse(question.correctOrder)
      : null;
    
    // Para DRAG_AND_DROP, envia os itens embaralhados (usuário precisa ver os itens, mas não a ordem correta)
    const shuffledItems = correctOrder && question.type === 'DRAG_AND_DROP'
      ? this.shuffleArray([...correctOrder])
      : null;

    return {
      ...question,
      options: question.options ? JSON.parse(question.options) : null,
      spreadsheetContext: question.spreadsheetContext
        ? JSON.parse(question.spreadsheetContext)
        : null,
      // Para drag-and-drop, envia itens embaralhados; caso contrário null
      correctOrder: shuffledItems,
      // NÃO enviar correctOption nem expectedValue ao frontend (anti-cheat)
      correctOption: undefined,
      expectedValue: undefined,
    };
  }

  // Embaralha array (Fisher-Yates shuffle)
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async submitAnswer(
    userId: string,
    questionId: string,
    value: string,
    timeSpentMs: number,
  ) {
    const question = await this.prisma.questions.findUnique({
      where: { id: questionId },
      include: { trail: true },
    });
    if (!question) throw new NotFoundException('Questão não encontrada');

    const isCorrect = this.checkAnswer(question, value);

    await this.prisma.useranswers.create({
      data: { userId, questionId, value, isCorrect, timeSpentMs },
    });

    if (isCorrect) {
      // Atualiza XP do usuário
      await this.prisma.users.update({
        where: { id: userId },
        data: { xp: { increment: question.xpReward } },
      });

      // Verifica se é a última questão da trilha
      const totalQuestionsInTrail = await this.prisma.questions.count({
        where: { trailId: question.trailId, isActive: true },
      });
      const isLastQuestion = question.order >= totalQuestionsInTrail;

      // Atualiza progresso na trilha
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

  private checkAnswer(question: any, value: string): boolean {
    const normalize = (s: string) =>
      s?.trim().toUpperCase().replace(/\s+/g, '').replace(/;/g, ',') ?? '';
    
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return parseInt(value) === question.correctOption;
      
      case 'SPREADSHEET_INPUT':
      case 'FORMULA_BUILDER':
        const userAnswer = normalize(value);
        const expectedAnswer = normalize(question.expectedValue ?? '');
        
        // Lista de respostas alternativas válidas (se existir no banco)
        const alternativeAnswers = question.alternativeAnswers
          ? JSON.parse(question.alternativeAnswers).map((a: string) => normalize(a))
          : [];
        
        // Verifica resposta principal
        if (userAnswer === expectedAnswer) return true;
        
        // Verifica respostas alternativas
        if (alternativeAnswers.includes(userAnswer)) return true;
        
        // Tratamento especial para fórmulas comuns (equivalências)
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
        } catch {
          return false;
        }
      
      default:
        return false;
    }
  }

  private checkFormulaEquivalence(
    userAnswer: string,
    expectedAnswer: string,
    alternativeAnswers: string[]
  ): boolean {
    // Verifica respostas alternativas já fornecidas
    if (alternativeAnswers.length > 0 && alternativeAnswers.includes(userAnswer)) {
      return true;
    }

    // Equivalências automáticas de fórmulas Excel
    const equivalentPairs = [
      // Adição: =A1+B1 ↔ =SOMA(A1,B1) ↔ =SOMA(A1:B1)
      ['=A1+B1', '=SOMA(A1,B1)', '=SOMA(A1:B1)', '=SUM(A1,B1)', '=SUM(A1:B1)'],
      
      // Multiplicação: =A1*B1 ↔ =PRODUTO(A1,B1)
      ['=A1*B1', '=PRODUTO(A1,B1)', '=PRODUCT(A1,B1)'],
      ['=A1*B1*C1', '=PRODUTO(A1,B1,C1)', '=PRODUTO(A1:C1)', '=PRODUCT(A1,B1,C1)'],
      
      // Funções em PT-BR e EN
      ['=SOMA(', '=SUM('],
      ['=MÉDIA(', '=AVERAGE('],
      ['=CONT.', '=COUNT'],
      ['=SE(', '=IF('],
      ['=SOMASE(', '=SUMIF('],
      ['=PROCV(', '=VLOOKUP('],
      ['=PROCX(', '=XLOOKUP('],
      ['=PGTO(', '=PMT('],
    ];

    // Verifica equivalência por substituição
    for (const group of equivalentPairs) {
      if (group.includes(userAnswer) && group.includes(expectedAnswer)) {
        return true;
      }
    }

    // Verifica equivalência por tradução de funções
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

  private isTrailUnlocked(
    order: number,
    trails: any[],
    userId: string,
  ): boolean {
    const prev = trails.find((t) => t.order === order - 1);
    if (!prev) return true;
    return prev.userProgress?.[0]?.completedAt != null;
  }
}
