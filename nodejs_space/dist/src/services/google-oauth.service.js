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
var GoogleOAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOAuthService = void 0;
const common_1 = require("@nestjs/common");
const google_auth_library_1 = require("google-auth-library");
const crypto_1 = require("crypto");
let GoogleOAuthService = GoogleOAuthService_1 = class GoogleOAuthService {
    logger = new common_1.Logger(GoogleOAuthService_1.name);
    oauth2Client;
    clientId;
    clientSecret;
    constructor() {
        this.clientId = process.env.GOOGLE_CLIENT_ID ?? '';
        this.clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';
        if (!this.clientId || !this.clientSecret) {
            this.logger.warn('⚠️  Google OAuth não configurado. Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env');
            return;
        }
        this.oauth2Client = new google_auth_library_1.OAuth2Client(this.clientId, this.clientSecret);
        this.logger.log(`✅ Google OAuth configurado`);
    }
    generateAuthUrl(redirectUri) {
        if (!this.oauth2Client) {
            throw new Error('Google OAuth não configurado');
        }
        const state = this.signState(redirectUri);
        const appOrigin = (process.env.APP_ORIGIN ?? '').replace(/\/$/, '');
        const backendCallback = new URL('/api/auth/google/callback', appOrigin).toString();
        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'openid',
            ],
            state,
            prompt: 'select_account',
            redirect_uri: backendCallback,
        });
        this.logger.log(`📝 State gerado: ${state}`);
        this.logger.log(`🔗 Auth URL gerada. Backend callback: ${backendCallback}, Frontend redirect: ${redirectUri}`);
        return authUrl;
    }
    async verifyAuthCode(code, state) {
        if (!this.oauth2Client) {
            throw new Error('Google OAuth não configurado');
        }
        this.logger.log(`🔐 Verificando auth code. Code: ${code?.substring(0, 20)}..., State: ${state?.substring(0, 30)}...`);
        const redirectUri = this.verifyState(state);
        if (!redirectUri) {
            throw new Error('State inválido ou expirado');
        }
        const appOrigin = (process.env.APP_ORIGIN ?? '').replace(/\/$/, '');
        const backendCallback = new URL('/api/auth/google/callback', appOrigin).toString();
        const { tokens } = await this.oauth2Client.getToken({
            code,
            redirect_uri: backendCallback,
        });
        this.oauth2Client.setCredentials(tokens);
        if (!tokens.id_token) {
            throw new Error('ID token não retornado pelo Google');
        }
        const ticket = await this.oauth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: this.clientId,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error('Payload do ID token inválido');
        }
        if (!payload.email_verified) {
            throw new Error('E-mail não verificado pelo Google');
        }
        this.logger.log(`✅ Usuário autenticado: ${payload?.email ?? 'unknown'}`);
        return {
            email: payload?.email ?? '',
            name: payload?.name ?? payload?.email?.split('@')[0] ?? 'Usuário',
            googleId: payload?.sub ?? '',
            redirectUri,
        };
    }
    signState(redirectUri) {
        const jwtSecret = process.env.JWT_SECRET ?? 'default-secret';
        const timestamp = Date.now();
        const payload = JSON.stringify({ redirectUri, timestamp });
        const signature = (0, crypto_1.createHmac)('sha256', jwtSecret)
            .update(payload)
            .digest('hex');
        return Buffer.from(`${signature}:${payload}`).toString('base64url');
    }
    verifyState(state) {
        try {
            this.logger.log(`🔍 Verificando state: ${state?.substring(0, 30)}...`);
            const decoded = Buffer.from(state, 'base64url').toString('utf-8');
            const separatorIndex = decoded.indexOf(':');
            if (separatorIndex === -1) {
                this.logger.error('❌ State format inválido: não contém ":"');
                return null;
            }
            const signature = decoded.substring(0, separatorIndex);
            const payload = decoded.substring(separatorIndex + 1);
            this.logger.log(`🔍 Signature: ${signature?.substring(0, 20)}...`);
            this.logger.log(`🔍 Payload: ${payload}`);
            const jwtSecret = process.env.JWT_SECRET ?? 'default-secret';
            const expectedSignature = (0, crypto_1.createHmac)('sha256', jwtSecret)
                .update(payload)
                .digest('hex');
            if (signature !== expectedSignature) {
                this.logger.warn(`⚠️  Assinatura do state inválida`);
                this.logger.warn(`Expected: ${expectedSignature}`);
                this.logger.warn(`Received: ${signature}`);
                return null;
            }
            const data = JSON.parse(payload);
            const age = Date.now() - data.timestamp;
            this.logger.log(`🔍 State age: ${age}ms (max: ${30 * 60 * 1000}ms)`);
            if (age > 30 * 60 * 1000) {
                this.logger.warn(`⚠️  State expirado (age: ${age}ms)`);
                return null;
            }
            this.logger.log(`✅ State válido, redirectUri: ${data.redirectUri}`);
            return data.redirectUri;
        }
        catch (error) {
            this.logger.error(`❌ Erro ao verificar state: ${error?.message ?? 'Erro desconhecido'}`);
            return null;
        }
    }
};
exports.GoogleOAuthService = GoogleOAuthService;
exports.GoogleOAuthService = GoogleOAuthService = GoogleOAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleOAuthService);
//# sourceMappingURL=google-oauth.service.js.map