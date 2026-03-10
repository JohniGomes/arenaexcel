import { PrismaService } from '../prisma/prisma.service';
export declare class BadgesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    verificarEConcederBadges(userId: string): Promise<string[]>;
    getBadgesUsuario(userId: string): Promise<({
        conquistado: boolean;
        dataConquista: Date | null;
        nome: string;
        tipo: string;
        emoji: string;
        id: string;
    } | {
        conquistado: boolean;
        dataConquista: Date | null;
        nome: string;
        tipo: string;
        emoji: string;
        id: string;
    } | {
        conquistado: boolean;
        dataConquista: Date | null;
        nome: string;
        tipo: string;
        emoji: string;
        id: string;
    } | {
        conquistado: boolean;
        dataConquista: Date | null;
        nome: string;
        tipo: string;
        emoji: string;
        id: string;
    } | {
        conquistado: boolean;
        dataConquista: Date | null;
        nome: string;
        tipo: string;
        emoji: string;
        id: string;
    } | {
        conquistado: boolean;
        dataConquista: Date | null;
        nome: string;
        tipo: string;
        emoji: string;
        id: string;
    } | {
        conquistado: boolean;
        dataConquista: Date | null;
        nome: string;
        tipo: string;
        emoji: string;
        id: string;
    } | {
        conquistado: boolean;
        dataConquista: Date | null;
        nome: string;
        tipo: string;
        emoji: string;
        id: string;
    } | {
        conquistado: boolean;
        dataConquista: Date | null;
        nome: string;
        tipo: string;
        emoji: string;
        id: string;
    } | {
        conquistado: boolean;
        dataConquista: Date | null;
        nome: string;
        tipo: string;
        emoji: string;
        id: string;
    } | {
        conquistado: boolean;
        dataConquista: Date | null;
        nome: string;
        tipo: string;
        emoji: string;
        id: string;
    } | {
        conquistado: boolean;
        dataConquista: Date | null;
        nome: string;
        tipo: string;
        emoji: string;
        id: string;
    } | {
        conquistado: boolean;
        dataConquista: Date | null;
        nome: string;
        tipo: string;
        emoji: string;
        id: string;
    } | {
        conquistado: boolean;
        dataConquista: Date | null;
        nome: string;
        tipo: string;
        emoji: string;
        id: string;
    } | {
        conquistado: boolean;
        dataConquista: Date | null;
        nome: string;
        tipo: string;
        emoji: string;
        id: string;
    })[]>;
    gerarCertificado(userId: string, badgeId: string, nomeAluno: string): Promise<{
        id: string;
        userId: string;
        badgeId: string;
        tipo: string;
        nomeAluno: string | null;
        criadoEm: Date;
    }>;
    validarCertificado(id: string): Promise<{
        valido: boolean;
        id: string;
        nomeAluno: string;
        curso: any;
        nivel: string;
        emoji: any;
        dataConquista: Date;
        emissor: string;
    } | null>;
}
