import { Controller, Get, Post, Param, Body, Request, UseGuards, Res, Req } from '@nestjs/common';
import type { Response, Request as ExpressRequest } from 'express';
import { BadgesService } from './badges.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('meus')
  async getMeusBadges(@Request() req: any) {
    return this.badgesService.getBadgesUsuario(req?.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verificar')
  async verificarBadges(@Request() req: any) {
    const novos = await this.badgesService.verificarEConcederBadges(req?.user?.id);
    return { novosBadges: novos };
  }

  @UseGuards(JwtAuthGuard)
  @Get('certificados/emitidos')
  async getCertificadosEmitidos(@Request() req: any) {
    return this.badgesService.getCertificadosEmitidos(req?.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('certificado/gerar')
  async gerarCertificado(@Request() req: any, @Body() body: { badgeId: string; nomeAluno: string }) {
    return this.badgesService.gerarCertificado(req?.user?.id, body?.badgeId, body?.nomeAluno);
  }

  // Página mobile-friendly (validação)
  @Get('certificado/validar/:id')
  async validarCertificado(
    @Param('id') id: string,
    @Res({ passthrough: false }) res: Response,
  ) {
    const cert = await this.badgesService.validarCertificado(id);
    
    if (!cert) {
      return res.status(404).send(this.renderInvalidCertificate());
    }

    return res.send(this.renderMobileFriendlyPage(cert));
  }

  // Certificado completo para PDF
  @Get('certificado/imprimir/:id')
  async imprimirCertificado(
    @Param('id') id: string,
    @Res({ passthrough: false }) res: Response,
  ) {
    const cert = await this.badgesService.validarCertificado(id);
    
    if (!cert) {
      return res.status(404).send(this.renderInvalidCertificate());
    }

    return res.send(this.renderFullCertificate(cert));
  }

  private renderMobileFriendlyPage(cert: any): string {
    const data = new Date(cert?.dataConquista).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const niveisConfig: Record<string, { medalha: string }> = {
      nivel_fundamentos: { medalha: '🥉' },
      nivel_basico: { medalha: '🥈' },
      nivel_intermediario: { medalha: '🥇' },
      nivel_avancado: { medalha: '🏆' },
      nivel_especialista: { medalha: '👑' },
    };

    const nivelConfig = niveisConfig[cert?.nivel] ?? { medalha: '🎓' };

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificado Arena Excel - ${cert?.nomeAluno ?? 'Aluno'}</title>
  <meta name="description" content="Certificado de conclusão do curso ${cert?.curso ?? 'Excel'} emitido pela Arena Excel">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #f0fff4;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #fff;
      border-radius: 20px;
      padding: 36px 28px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 8px 40px rgba(0,0,0,0.10);
      border: 2px solid #2ECC71;
      text-align: center;
    }
    .selo {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #d4edda;
      color: #155724;
      padding: 8px 20px;
      border-radius: 30px;
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 24px;
    }
    .medalha { font-size: 64px; margin-bottom: 12px; display: block; }
    .nome { font-size: 26px; font-weight: 800; color: #1a3a5c; margin-bottom: 8px; }
    .curso { font-size: 15px; color: #555; margin-bottom: 4px; }
    .curso strong { color: #1a3a5c; }
    .divider { width: 60%; height: 1px; background: linear-gradient(90deg, transparent, #c8a84b, transparent); margin: 16px auto; }
    .data-label { font-size: 11px; color: #888; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
    .data-valor { font-size: 15px; font-weight: 700; color: #1a3a5c; }
    .cert-id { font-size: 11px; color: #aaa; letter-spacing: 1px; margin-top: 6px; }
    .btn-pdf {
      display: block;
      margin: 24px auto 0;
      padding: 14px 28px;
      background: linear-gradient(135deg, #2ECC71, #27AE60);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(46,204,113,0.3);
    }
    .rodape { margin-top: 28px; padding-top: 20px; border-top: 1px solid #eee; }
    .rodape p { color: #2ECC71; font-weight: 700; font-size: 14px; }
    .rodape span { color: #aaa; font-size: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="selo">✅ Certificado Válido</div>
    <span class="medalha">${nivelConfig.medalha}</span>
    <div class="nome">${cert?.nomeAluno ?? ''}</div>
    <div class="curso">Concluiu o módulo <strong>${cert?.curso ?? ''}</strong></div>
    <div class="curso">no <strong>Arena Excel</strong></div>
    <div class="divider"></div>
    <div class="data-label">Data de conclusão</div>
    <div class="data-valor">${data}</div>
    <div class="cert-id">Nº ${cert?.id ?? ''}</div>
    <a class="btn-pdf" href="/api/badges/certificado/imprimir/${cert?.id ?? ''}" target="_blank">
      🖨️ Abrir Certificado Completo / PDF
    </a>
    <div class="rodape">
      <p>🐯 Arena Excel</p>
      <span>Aprenda · Pratique · Domine</span>
    </div>
  </div>
</body>
</html>
    `;
  }

  private renderFullCertificate(cert: any): string {
    const data = new Date(cert?.dataConquista).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const niveisConfig: Record<string, { medalha: string; cor: string; descricao: string }> = {
      nivel_fundamentos: {
        medalha: '\ud83e\udd49',
        cor: '#cd7f32',
        descricao: 'demonstrando dom\u00ednio dos conceitos fundamentais do Excel, incluindo navega\u00e7\u00e3o, formata\u00e7\u00e3o e f\u00f3rmulas b\u00e1sicas.',
      },
      nivel_basico: {
        medalha: '\ud83e\udd48',
        cor: '#aaa9ad',
        descricao: 'demonstrando profici\u00eancia em fun\u00e7\u00f5es essenciais, gr\u00e1ficos e organiza\u00e7\u00e3o de dados no Excel.',
      },
      nivel_intermediario: {
        medalha: '\ud83e\udd47',
        cor: '#d4af37',
        descricao: 'demonstrando dom\u00ednio de fun\u00e7\u00f5es avan\u00e7adas, tabelas din\u00e2micas e an\u00e1lise de dados profissional.',
      },
      nivel_avancado: {
        medalha: '\ud83c\udfc6',
        cor: '#2ECC71',
        descricao: 'demonstrando expertise em automa\u00e7\u00f5es, f\u00f3rmulas complexas e solu\u00e7\u00f5es avan\u00e7adas no Excel.',
      },
      nivel_especialista: {
        medalha: '\ud83d\udc51',
        cor: '#c8a84b',
        descricao: 'atingindo o mais alto n\u00edvel de dom\u00ednio do Excel, com capacidade de resolver desafios profissionais complexos.',
      },
    };

    const nivelConfig = niveisConfig[cert?.nivel] ?? {
      medalha: '\ud83c\udf93',
      cor: '#2ECC71',
      descricao: 'demonstrando profici\u00eancia e dedica\u00e7\u00e3o no aprendizado do Microsoft Excel.',
    };

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(`https://arenaexcel.excelcomjohni.com.br/api/badges/certificado/validar/${cert?.id}`)}&margin=4`;

    return this.renderCertificateTemplate(cert, nivelConfig, data, qrUrl);
  }

  private renderInvalidCertificate(): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificado n\u00e3o encontrado - Arena Excel</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; text-align: center; padding: 80px 20px; background: #fff; min-height: 100vh; }
    .emoji { font-size: 64px; }
    h1 { color: #e74c3c; margin-top: 16px; font-size: 28px; }
    p { color: #666; margin-top: 8px; font-size: 16px; }
  </style>
</head>
<body>
  <div class="emoji">\u274c</div>
  <h1>Certificado n\u00e3o encontrado</h1>
  <p>Este certificado n\u00e3o existe ou foi removido.</p>
</body>
</html>
    `;
  }

  private renderCertificateTemplate(cert: any, nivelConfig: any, data: string, qrUrl: string): string {
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificado Arena Excel - ${cert?.nomeAluno ?? 'Aluno'}</title>
  <meta name="description" content="Certificado de conclusão do curso ${cert?.curso ?? 'Excel'} emitido pela Arena Excel">
  <meta property="og:title" content="Certificado Arena Excel - ${cert?.nomeAluno ?? 'Aluno'}">
  <meta property="og:description" content="Conclusão do módulo ${cert?.curso ?? 'Excel'}">
  <meta property="og:type" content="website">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Montserrat:wght@400;600;700;800&family=Dancing+Script:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      background: #1a1a1a;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 70px 0 40px;
    }
    
    /* Botão fixo no topo */
    .no-print {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 999;
    }
    
    .btn-save {
      padding: 12px 24px;
      background: linear-gradient(135deg, #2ECC71, #27AE60);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-family: Montserrat, sans-serif;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(46,204,113,0.3);
    }
    
    /* Certificado com tamanho fixo — sem overflow hidden */
    .certificate-wrapper {
      width: 1122px;
      height: 794px;
      background: #fff;
      position: relative;
      overflow: visible;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      flex-shrink: 0;
      border: 2px solid ${nivelConfig?.cor ?? '#2ECC71'};
    }
    
    /* No mobile: o usuário dá scroll/zoom para ver o A4 completo */
    /* Não aplicar nenhum scale ou transform */
    
    .wave-top, .wave-bottom { position: absolute; z-index: 2; }
    .wave-top { top: 0; left: 0; width: 35.5%; height: 40.8%; }
    .wave-bottom { bottom: 0; right: 0; width: 35.5%; height: 40.8%; }
    
    .border-inner {
      position: absolute;
      top: 16px;
      bottom: 16px;
      left: 16px;
      right: 16px;
      border: 1px solid #ccc;
      z-index: 10;
      pointer-events: none;
    }
    
    .corner { position: absolute; width: 44px; height: 44px; z-index: 6; }
    .corner-tl { top: 8px; left: 8px; }
    .corner-tr { top: 8px; right: 8px; transform: scaleX(-1); }
    .corner-bl { bottom: 8px; left: 8px; transform: scaleY(-1); }
    .corner-br { bottom: 8px; right: 8px; transform: scale(-1,-1); }
    
    .medal {
      position: absolute;
      top: 28px;
      right: 80px;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    
    .medal-icon {
      font-size: 72px;
      filter: drop-shadow(0 4px 12px ${nivelConfig?.cor ?? '#2ECC71'}88);
      line-height: 1;
    }
    
    .medal-ribbons {
      display: flex;
      gap: 5px;
      margin-top: -4px;
    }
    
    .ribbon {
      width: 16px;
      height: 30px;
      clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%);
    }
    
    .ribbon-1 { background: linear-gradient(180deg, #1a7a3c, #2ECC71); }
    .ribbon-2 { background: linear-gradient(180deg, #27AE60, #1a7a3c); }
    
    .content {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 5;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 42px 90px 28px;
      font-family: Montserrat, sans-serif;
    }
    
    .title {
      font-family: 'Playfair Display', serif;
      font-size: 58px;
      font-weight: 900;
      color: #1a3a5c;
      letter-spacing: 4px;
      line-height: 1;
    }
    
    .subtitle {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 8px;
      color: #1a3a5c;
      margin-top: 5px;
      text-transform: uppercase;
    }
    
    .label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 4px;
      color: #8B4513;
      text-transform: uppercase;
      margin-top: 22px;
    }
    
    .student-name {
      font-family: 'Playfair Display', serif;
      font-size: 52px;
      font-weight: 700;
      color: #1a3a5c;
      text-align: center;
      line-height: 1.1;
      margin-top: 6px;
    }
    
    .divider {
      width: 55%;
      height: 1px;
      background: linear-gradient(90deg, transparent, #999 20%, #999 80%, transparent);
      margin: 12px 0 14px;
    }
    
    .description {
      font-size: 13px;
      color: #333;
      text-align: center;
      line-height: 1.8;
      max-width: 520px;
    }
    
    .footer {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      width: 100%;
      margin-top: auto;
      padding: 0 4px;
    }
    
    .excelino { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .excelino-icon { font-size: 52px; }
    .excelino-text { font-size: 8px; color: #1a7a3c; font-weight: 700; letter-spacing: 1px; }
    
    .signature { display: flex; flex-direction: column; align-items: center; }
    .signature-script { font-family: 'Dancing Script', cursive; font-size: 34px; color: #1a3a5c; font-weight: 700; }
    .signature-line { width: 190px; height: 1.5px; background: #222; margin: 2px 0 5px; }
    .signature-name { font-size: 11px; font-weight: 800; color: #1a3a5c; letter-spacing: 2px; text-transform: uppercase; }
    .signature-title { font-size: 11px; color: #c8a84b; font-weight: 500; }
    
    .date-qr { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
    .date-box { text-align: right; }
    .date-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #888; margin-bottom: 3px; }
    .date-value { font-size: 13px; font-weight: 700; color: #1a3a5c; }
    .cert-id { font-size: 9px; color: #666; letter-spacing: 1px; margin-top: 3px; font-weight: 600; }
    .qr-box { display: flex; flex-direction: column; align-items: center; gap: 3px; }
    .qr-img { width: 70px; height: 70px; border: 1.5px solid #1a3a5c; border-radius: 3px; }
    .qr-label { font-size: 7px; color: #888; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; }
    
    /* RESPONSIVIDADE */
    @media (max-width: 900px) {
      .certificate-wrapper { max-width: 90vw; }
      .content { padding: 36px 60px 24px; }
      .title { font-size: 48px; }
      .student-name { font-size: 42px; }
      .description { font-size: 12px; max-width: 450px; }
      .medal { right: 60px; }
      .medal-icon { font-size: 60px; }
    }
    
    @media (max-width: 700px) {
      .btn-save { 
        top: 10px; 
        right: 10px; 
        padding: 10px 18px; 
        font-size: 12px; 
      }
      .certificate-wrapper { max-width: 95vw; }
      .content { padding: 28px 40px 20px; }
      .title { font-size: 38px; letter-spacing: 2px; }
      .subtitle { font-size: 11px; letter-spacing: 5px; }
      .label { font-size: 9px; letter-spacing: 2px; margin-top: 16px; }
      .student-name { font-size: 32px; }
      .divider { width: 65%; margin: 10px 0 12px; }
      .description { font-size: 11px; line-height: 1.6; max-width: 100%; }
      .medal { top: 20px; right: 40px; }
      .medal-icon { font-size: 48px; }
      .ribbon { width: 12px; height: 22px; }
      .excelino-icon { font-size: 40px; }
      .excelino-text { font-size: 7px; }
      .signature-script { font-size: 26px; }
      .signature-line { width: 140px; }
      .signature-name { font-size: 9px; }
      .signature-title { font-size: 9px; }
      .date-label { font-size: 8px; }
      .date-value { font-size: 11px; }
      .cert-id { font-size: 8px; }
      .qr-img { width: 55px; height: 55px; }
      .qr-label { font-size: 6px; }
      .wave-top, .wave-bottom { width: 30%; height: 35%; }
      .corner { width: 32px; height: 32px; }
      .border-inner { top: 12px; bottom: 12px; left: 12px; right: 12px; }
    }
    
    @media (max-width: 480px) {
      body { padding: 10px; }
      .btn-save { top: 5px; right: 5px; padding: 8px 14px; font-size: 11px; }
      .certificate-wrapper { max-width: 98vw; }
      .content { padding: 20px 24px 16px; }
      .title { font-size: 28px; letter-spacing: 1px; }
      .subtitle { font-size: 9px; letter-spacing: 3px; margin-top: 3px; }
      .label { font-size: 8px; letter-spacing: 1px; margin-top: 12px; }
      .student-name { font-size: 24px; }
      .divider { width: 70%; margin: 8px 0 10px; }
      .description { font-size: 9px; line-height: 1.5; }
      .medal { top: 16px; right: 24px; }
      .medal-icon { font-size: 36px; }
      .ribbon { width: 10px; height: 18px; }
      .footer { flex-direction: column; gap: 12px; align-items: center; }
      .excelino-icon { font-size: 32px; }
      .excelino-text { font-size: 6px; }
      .signature-script { font-size: 20px; }
      .signature-line { width: 110px; height: 1px; }
      .signature-name { font-size: 8px; letter-spacing: 1px; }
      .signature-title { font-size: 8px; }
      .date-qr { flex-direction: row-reverse; gap: 12px; align-items: center; }
      .date-box { text-align: left; }
      .date-label { font-size: 7px; }
      .date-value { font-size: 10px; }
      .cert-id { font-size: 7px; }
      .qr-img { width: 45px; height: 45px; }
      .qr-label { font-size: 5px; }
      .wave-top, .wave-bottom { width: 28%; height: 32%; }
      .corner { width: 24px; height: 24px; }
      .corner-tl, .corner-tr { top: 6px; }
      .corner-bl, .corner-br { bottom: 6px; }
      .corner-tl, .corner-bl { left: 6px; }
      .corner-tr, .corner-br { right: 6px; }
      .border-inner { top: 10px; bottom: 10px; left: 10px; right: 10px; }
    }
    
    @media print {
      body {
        background: #fff;
        padding: 0;
        margin: 0;
      }
      .no-print { display: none; }
      .certificate-wrapper {
        box-shadow: none;
        width: 297mm;
        height: 210mm;
        overflow: hidden;
      }
      @page {
        size: A4 landscape;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  
  <!-- BOTÃO SALVAR PDF -->
  <div class="no-print">
    <button class="btn-save" onclick="window.print()">
      🖨️ Salvar PDF
    </button>
  </div>

  <!-- CERTIFICADO -->
  <div class="certificate-wrapper">

    <!-- ONDA SUPERIOR ESQUERDA -->
    <svg class="wave-top" viewBox="0 0 320 260" fill="none">
      <path d="M0 0 L320 0 L320 40 C280 60 220 55 170 90 C120 125 90 170 60 210 C38 240 14 262 0 270 Z" fill="#145a2e"/>
      <path d="M0 0 L255 0 L255 20 C218 45 165 42 128 78 C90 112 68 158 46 198 C28 228 10 252 0 262 Z" fill="#1e8449"/>
      <path d="M0 0 L190 0 L190 10 C160 35 116 34 86 66 C56 97 40 140 24 178 C12 208 4 234 0 248 Z" fill="#2ECC71"/>
      <path d="M0 175 C16 160 42 152 68 158 C100 165 124 183 148 200 C170 216 186 230 196 244 L176 262 C163 246 146 232 122 215 C96 197 68 180 38 174 C18 170 3 178 0 186 Z" fill="#c8a84b" opacity="0.55"/>
    </svg>

    <!-- ONDA INFERIOR DIREITA -->
    <svg class="wave-bottom" viewBox="0 0 320 260" fill="none">
      <path d="M0 230 C14 222 42 208 70 200 C112 189 160 196 198 182 C240 166 272 134 300 100 C312 83 320 65 320 45 L320 260 L0 260 Z" fill="#145a2e"/>
      <path d="M65 252 C84 240 116 228 148 220 C186 210 224 212 256 198 C288 185 312 158 320 126 L320 260 L55 260 Z" fill="#1e8449"/>
      <path d="M135 262 C158 250 186 240 214 232 C246 224 274 222 300 208 C316 198 320 180 320 165 L320 260 L125 260 Z" fill="#2ECC71"/>
      <path d="M320 75 C303 92 277 100 250 95 C218 88 194 70 170 52 C148 36 132 22 122 10 L142 0 C154 13 170 28 193 45 C218 62 246 80 276 86 C298 91 314 82 320 73 Z" fill="#c8a84b" opacity="0.55"/>
    </svg>

    <!-- BORDA FINA -->
    <div class="border-inner"></div>

    <!-- CANTOS ORNAMENTAIS -->
    <svg class="corner corner-tl" viewBox="0 0 44 44" fill="none">
      <path d="M4 40 L4 4 L40 4" stroke="#c8a84b" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M9 35 L9 9 L35 9" stroke="#c8a84b" stroke-width="0.8" stroke-linecap="round" fill="none" opacity="0.5"/>
      <circle cx="4" cy="4" r="2.5" fill="#c8a84b"/>
    </svg>
    <svg class="corner corner-tr" viewBox="0 0 44 44" fill="none">
      <path d="M4 40 L4 4 L40 4" stroke="#c8a84b" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M9 35 L9 9 L35 9" stroke="#c8a84b" stroke-width="0.8" stroke-linecap="round" fill="none" opacity="0.5"/>
      <circle cx="4" cy="4" r="2.5" fill="#c8a84b"/>
    </svg>
    <svg class="corner corner-bl" viewBox="0 0 44 44" fill="none">
      <path d="M4 40 L4 4 L40 4" stroke="#c8a84b" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M9 35 L9 9 L35 9" stroke="#c8a84b" stroke-width="0.8" stroke-linecap="round" fill="none" opacity="0.5"/>
      <circle cx="4" cy="4" r="2.5" fill="#c8a84b"/>
    </svg>
    <svg class="corner corner-br" viewBox="0 0 44 44" fill="none">
      <path d="M4 40 L4 4 L40 4" stroke="#c8a84b" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M9 35 L9 9 L35 9" stroke="#c8a84b" stroke-width="0.8" stroke-linecap="round" fill="none" opacity="0.5"/>
      <circle cx="4" cy="4" r="2.5" fill="#c8a84b"/>
    </svg>

    <!-- MEDALHA DO MÓDULO -->
    <div class="medal">
      <div class="medal-icon">
        ${nivelConfig?.medalha ?? '🎓'}
      </div>
      <div class="medal-ribbons">
        <div class="ribbon ribbon-1"></div>
        <div class="ribbon ribbon-2"></div>
      </div>
    </div>

    <!-- CONTEÚDO -->
    <div class="content">
      
      <div class="title">
        CERTIFICADO
      </div>
      <div class="subtitle">
        De Conclusão
      </div>

      <div class="label">
        Este certificado é apresentado a
      </div>

      <div class="student-name">
        ${cert?.nomeAluno ?? 'Aluno'}
      </div>

      <div class="divider"></div>

      <div class="description">
        Por ter concluído com êxito o módulo <strong style="color: #1a3a5c;">${cert?.curso ?? 'Excel'}</strong> no aplicativo <strong style="color: #1a3a5c;">Arena Excel</strong>, ${nivelConfig?.descricao ?? 'demonstrando proficiência no Excel.'}
      </div>

      <!-- RODAPÉ -->
      <div class="footer">

        <!-- Excelino -->
        <div class="excelino">
          <div class="excelino-icon">🐯</div>
          <span class="excelino-text">ARENA EXCEL</span>
        </div>

        <!-- Assinatura -->
        <div class="signature">
          <span class="signature-script">Johni Michael</span>
          <div class="signature-line"></div>
          <span class="signature-name">Johni Michael</span>
          <span class="signature-title">Founder · Arena Excel</span>
        </div>

        <!-- QR + Data -->
        <div class="date-qr">
          <div class="date-box">
            <div class="date-label">Data de Conclusão</div>
            <div class="date-value">${data}</div>
            <div class="cert-id">Nº ${cert?.id ?? ''}</div>
          </div>
          <div class="qr-box">
            <img src="${qrUrl}" class="qr-img" alt="QR Code"/>
            <span class="qr-label">Verificar</span>
          </div>
        </div>

      </div>
    </div>
  </div>


</body>
</html>
    `;
    
    return htmlTemplate;
  }
}
