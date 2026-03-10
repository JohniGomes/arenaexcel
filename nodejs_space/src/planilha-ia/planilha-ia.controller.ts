import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlanilhaIAService } from './planilha-ia.service';

@Controller('api/planilha-ia')
@UseGuards(JwtAuthGuard)
export class PlanilhaIAController {
  constructor(private readonly service: PlanilhaIAService) {}

  @Post('analisar')
  @HttpCode(HttpStatus.OK)
  async analisar(@Request() req: any, @Body() body: { dados: string; nomeArquivo: string }) {
    return this.service.analisar(req.user.id, body.dados, body.nomeArquivo);
  }

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(@Request() req: any, @Body() body: { dados: string; mensagens: any[] }) {
    return this.service.chat(req.user.id, body.dados, body.mensagens);
  }

  @Post('extrair-imagem')
  @HttpCode(HttpStatus.OK)
  async extrairImagem(@Request() req: any, @Body() body: { base64: string }) {
    return this.service.extrairDaImagem(req.user.id, body.base64);
  }
}
