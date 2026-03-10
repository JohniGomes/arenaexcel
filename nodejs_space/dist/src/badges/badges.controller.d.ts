import type { Response } from 'express';
import { BadgesService } from './badges.service';
export declare class BadgesController {
    private readonly badgesService;
    constructor(badgesService: BadgesService);
    getMeusBadges(req: any): Promise<({
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
    verificarBadges(req: any): Promise<{
        novosBadges: string[];
    }>;
    gerarCertificado(req: any, body: {
        badgeId: string;
        nomeAluno: string;
    }): Promise<{
        id: string;
        userId: string;
        badgeId: string;
        tipo: string;
        nomeAluno: string | null;
        criadoEm: Date;
    }>;
    validarCertificado(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    imprimirCertificado(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    private renderMobileFriendlyPage;
    private renderFullCertificate;
    private renderInvalidCertificate;
    private renderCertificateTemplate;
}
