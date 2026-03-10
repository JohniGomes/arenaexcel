import { Injectable, Logger } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { createHmac } from 'crypto';

@Injectable()
export class GoogleOAuthService {
  private readonly logger = new Logger(GoogleOAuthService.name);
  private oauth2Client: OAuth2Client;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID ?? '';
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';

    if (!this.clientId || !this.clientSecret) {
      this.logger.warn(
        '⚠️  Google OAuth não configurado. Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env',
      );
      return;
    }

    this.oauth2Client = new OAuth2Client(
      this.clientId,
      this.clientSecret,
    );

    this.logger.log(`✅ Google OAuth configurado`);
  }

  /**
   * Gera URL de autorização do Google com state assinado
   */
  generateAuthUrl(redirectUri: string): string {
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

  /**
   * Verifica código de autorização e retorna dados do usuário
   */
  async verifyAuthCode(
    code: string,
    state: string,
  ): Promise<{ email: string; name: string; googleId: string; redirectUri: string }> {
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

  /**
   * Assina state com HMAC-SHA256 usando JWT_SECRET
   */
  private signState(redirectUri: string): string {
    const jwtSecret = process.env.JWT_SECRET ?? 'default-secret';
    const timestamp = Date.now();
    const payload = JSON.stringify({ redirectUri, timestamp });
    const signature = createHmac('sha256', jwtSecret)
      .update(payload)
      .digest('hex');

    return Buffer.from(`${signature}:${payload}`).toString('base64url');
  }

  /**
   * Verifica assinatura do state e retorna redirectUri
   */
  private verifyState(state: string): string | null {
    try {
      this.logger.log(`🔍 Verificando state: ${state?.substring(0, 30)}...`);

      const decoded = Buffer.from(state, 'base64url').toString('utf-8');

      // ✅ Usa indexOf para pegar só o PRIMEIRO ":" sem quebrar a URL
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
      const expectedSignature = createHmac('sha256', jwtSecret)
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

      // State expira em 30 minutos
      if (age > 30 * 60 * 1000) {
        this.logger.warn(`⚠️  State expirado (age: ${age}ms)`);
        return null;
      }

      this.logger.log(`✅ State válido, redirectUri: ${data.redirectUri}`);
      return data.redirectUri;
    } catch (error) {
      this.logger.error(`❌ Erro ao verificar state: ${error?.message ?? 'Erro desconhecido'}`);
      return null;
    }
  }
}