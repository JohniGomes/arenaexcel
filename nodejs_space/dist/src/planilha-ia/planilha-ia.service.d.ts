import { PrismaService } from '../prisma/prisma.service';
export declare class PlanilhaIAService {
    private prisma;
    private readonly logger;
    private abacusApiKey;
    private abacusApiUrl;
    constructor(prisma: PrismaService);
    private verificarLimite;
    private registrarUso;
    analisar(userId: string, dados: string, nomeArquivo: string): Promise<{
        insights: any;
        analisesRestantes: number;
    }>;
    chat(userId: string, dados: string, mensagens: {
        role: string;
        content: string;
    }[]): Promise<{
        resposta: any;
    }>;
    extrairDaImagem(userId: string, base64: string): Promise<{
        texto: any;
    }>;
}
