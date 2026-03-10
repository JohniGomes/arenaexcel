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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationService = NotificationService_1 = class NotificationService {
    prisma;
    logger = new common_1.Logger(NotificationService_1.name);
    expo = null;
    constructor(prisma) {
        this.prisma = prisma;
        this.initializeExpo();
    }
    async initializeExpo() {
        const { Expo } = await import('expo-server-sdk');
        this.expo = new Expo();
    }
    async savePushToken(userId, token) {
        await this.prisma.users.update({
            where: { id: userId },
            data: { pushToken: token },
        });
        this.logger.log(`✅ Push token salvo para usuário: ${userId}`);
    }
    async sendToUser(userId, title, body, data) {
        if (!this.expo) {
            await this.initializeExpo();
        }
        const { Expo } = await import('expo-server-sdk');
        const user = await this.prisma.users.findUnique({ where: { id: userId } });
        if (!user?.pushToken)
            return;
        if (!Expo.isExpoPushToken(user.pushToken))
            return;
        const message = {
            to: user.pushToken,
            sound: 'default',
            title,
            body,
            data: data ?? {},
            badge: 1,
        };
        const chunks = this.expo.chunkPushNotifications([message]);
        for (const chunk of chunks) {
            try {
                await this.expo.sendPushNotificationsAsync(chunk);
            }
            catch (error) {
                this.logger.error(`Erro ao enviar notificação: ${error}`);
            }
        }
        this.logger.log(`📲 Notificação enviada: "${title}" → usuário ${userId}`);
    }
    async checkInactiveUsers() {
        const messages = [
            { title: '🐯 Ei, saudade de você!', body: 'O Excelino tá aqui te esperando. Bora estudar?' },
            { title: '😢 Faz dias que você sumiu...', body: 'Seu Excel tá ficando enferrujado. 5 minutinhos hoje?' },
            { title: '🏆 Não deixa o rival te passar!', body: 'Enquanto você some, outros estão acumulando XP. Volta logo!' },
            { title: '📊 Tá pesquisando PROCV no Google?', body: 'Para isso! Aprende de vez aqui no Arena Excel 😂' },
            { title: '🔥 Sua sequência esfriou...', body: 'Você tinha um streak incrível. Vem reacender agora!' },
        ];
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        const inactiveUsers = await this.prisma.users.findMany({
            where: { lastLoginAt: { lt: twoDaysAgo } },
        });
        for (const user of inactiveUsers) {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            await this.sendToUser(user.id, msg.title, msg.body, { screen: 'Home' });
        }
        this.logger.log(`📲 Notificações de inatividade enviadas para ${inactiveUsers.length} usuários`);
    }
    async checkStreakAtRisk() {
        const messages = [
            { title: '🔥 Seu streak tá em risco!', body: 'Falta pouco para a meia-noite. Não deixa a sequência acabar!' },
            { title: '⏰ Última chance hoje!', body: 'Complete uma lição agora e salve seu streak. Vai rápido!' },
            { title: '😰 Quase perdendo tudo!', body: 'Você tem {streak} dias de sequência. Não desperdiça isso!' },
        ];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const usersAtRisk = await this.prisma.users.findMany({
            where: { streak: { gt: 0 }, lastStudyAt: { lt: today } },
        });
        for (const user of usersAtRisk) {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            const body = msg.body.replace('{streak}', user.streak?.toString() ?? '');
            await this.sendToUser(user.id, msg.title, body, { screen: 'Learn' });
        }
        this.logger.log(`🔥 Alertas de streak enviados para ${usersAtRisk.length} usuários`);
    }
    async sendMorningMotivation() {
        const messages = [
            { title: '☀️ Bom dia, campeão!', body: 'Uma lição por dia mantece o chefe satisfeito 😎 Vamos?' },
            { title: '🚀 Hoje é dia de evoluir!', body: 'Quem domina Excel domina o mercado. Bora começar?' },
            { title: '📈 Sua carreira agradece!', body: 'Mais um dia, mais uma habilidade. Que tal aprender algo novo agora?' },
            { title: '🏅 Destrave sua conquista!', body: 'Você tá tão perto de subir de nível. Um empurrãozinho hoje?' },
            { title: '💡 Dica do Excelino:', body: 'Sabia que 73% dos profissionais que dominam Excel ganham mais? Vai lá!' },
        ];
        const allUsers = await this.prisma.users.findMany();
        for (const user of allUsers) {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            await this.sendToUser(user.id, msg.title, msg.body, { screen: 'Home' });
        }
        this.logger.log(`☀️ Bom dia enviado para ${allUsers.length} usuários`);
    }
    async sendDailyTip() {
        const tips = [
            { title: '💡 Dica do dia!', body: 'Use Ctrl+T para transformar qualquer tabela em tabela dinâmica na hora!' },
            { title: '⚡ Atalho poderoso!', body: 'Alt+= insere SOMA automaticamente. Economiza segundos todo dia!' },
            { title: '🎯 Você sabia?', body: 'PROCX substituiu o PROCV. Mais simples e busca em qualquer direção!' },
            { title: '🔥 Truque de Excel!', body: 'Ctrl+` mostra todas as fórmulas da planilha de uma vez. Tente agora!' },
            { title: '📊 Dica de gráfico!', body: 'Selecione seus dados e aperte Alt+F1. Gráfico criado na hora!' },
            { title: '🧠 Sabia disso?', body: 'SOMASES aceita quantos critérios quiser. Fim do SOMASE limitado!' },
            { title: '🚀 Produtividade!', body: 'Ctrl+Shift+L ativa filtros em qualquer tabela. Sem precisar de mouse!' },
        ];
        const allUsers = await this.prisma.users.findMany();
        for (const user of allUsers) {
            const tip = tips[Math.floor(Math.random() * tips.length)];
            await this.sendToUser(user.id, tip.title, tip.body, { screen: 'Wiki' });
        }
        this.logger.log(`💡 Dica do dia enviada para ${allUsers.length} usuários`);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map