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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let EmailService = EmailService_1 = class EmailService {
    logger = new common_1.Logger(EmailService_1.name);
    resend = null;
    emailFrom;
    constructor() {
        const resendApiKey = process.env.RESEND_API_KEY;
        this.emailFrom = process.env.EMAIL_FROM ?? 'Arena Excel <noreply@excelcomjohni.com.br>';
        if (!resendApiKey) {
            this.logger.warn('⚠️  Resend API Key não configurada. E-mails serão apenas logados (não enviados).');
            this.logger.warn('Configure RESEND_API_KEY no .env para enviar e-mails reais.');
            return;
        }
        this.resend = new resend_1.Resend(resendApiKey);
        this.logger.log(`✅ EmailService configurado com Resend (${this.emailFrom})`);
    }
    async sendPasswordResetEmail(email, resetToken) {
        const appOrigin = (process.env.APP_ORIGIN ?? 'https://arenaexcel.excelcomjohni.com.br').replace(/\/$/, '');
        const resetUrl = `${appOrigin}/api/auth/reset-password-page?token=${resetToken}`;
        const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1E88E5 0%, #1565C0 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">🐯 Arena Excel</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Redefinição de Senha</h2>
          <p style="color: #666; font-size: 16px;">Olá,</p>
          <p style="color: #666; font-size: 16px;">
            Você solicitou a redefinição de senha da sua conta Arena Excel.
          </p>
          <p style="color: #666; font-size: 16px;">
            Clique no botão abaixo para criar uma nova senha:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #1E88E5; color: white; padding: 15px 40px; 
                      text-decoration: none; border-radius: 8px; font-size: 16px;
                      display: inline-block;">
              Redefinir Senha
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            Ou copie e cole este link no seu navegador:<br>
            <a href="${resetUrl}" style="color: #1E88E5; word-break: break-all;">${resetUrl}</a>
          </p>
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            ⏰ Este link expira em 1 hora.
          </p>
          <p style="color: #999; font-size: 14px;">
            Se você não solicitou esta redefinição, ignore este e-mail.
          </p>
        </div>
        <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} Arena Excel - Aprenda Excel com o Excelino 📊
        </div>
      </div>
    `;
        if (!this.resend) {
            this.logger.warn(`📧 [SIMULADO] E-mail de reset para: ${email}\nToken: ${resetToken}\nURL: ${resetUrl}`);
            return;
        }
        try {
            const { data, error } = await this.resend.emails.send({
                from: this.emailFrom,
                to: [email],
                subject: '🔐 Redefinição de Senha - Arena Excel',
                html: htmlContent,
            });
            if (error) {
                this.logger.error(`❌ Erro Resend ao enviar para ${email}: ${error?.message ?? JSON.stringify(error)}`);
                throw new Error('Falha ao enviar e-mail. Tente novamente mais tarde.');
            }
            this.logger.log(`✅ E-mail de reset enviado para: ${email} (ID: ${data?.id ?? 'N/A'})`);
        }
        catch (error) {
            this.logger.error(`❌ Erro ao enviar e-mail para ${email}: ${error?.message ?? 'Erro desconhecido'}`, error?.stack);
            throw new Error('Falha ao enviar e-mail. Tente novamente mais tarde.');
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map