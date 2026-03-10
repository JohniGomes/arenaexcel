import { PlanilhaIAService } from './planilha-ia.service';
export declare class PlanilhaIAController {
    private readonly service;
    constructor(service: PlanilhaIAService);
    analisar(req: any, body: {
        dados: string;
        nomeArquivo: string;
    }): Promise<{
        insights: any;
        analisesRestantes: number;
    }>;
    chat(req: any, body: {
        dados: string;
        mensagens: any[];
    }): Promise<{
        resposta: any;
    }>;
    extrairImagem(req: any, body: {
        base64: string;
    }): Promise<{
        texto: any;
    }>;
}
