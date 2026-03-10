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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const google_callback_dto_1 = require("./dto/google-callback.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }
    async resetPasswordPage(token, res) {
        const appScheme = process.env.APP_SCHEME ?? 'abacusai1771126748';
        const deepLink = `${appScheme}://reset-password?token=${token}`;
        const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Redefinir Senha - Arena Excel</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #1E88E5 0%, #1565C0 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 16px;
          padding: 40px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          text-align: center;
        }
        .logo { font-size: 64px; margin-bottom: 20px; }
        h1 { color: #333; margin-bottom: 20px; font-size: 24px; }
        p { color: #666; margin-bottom: 30px; line-height: 1.6; }
        .btn {
          background: #1E88E5;
          color: white;
          padding: 16px 40px;
          border-radius: 8px;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          font-weight: 600;
          transition: background 0.3s;
        }
        .btn:hover { background: #1565C0; }
        .help-text {
          margin-top: 30px;
          font-size: 14px;
          color: #999;
        }
        .spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #1E88E5;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🐯</div>
        <h1>Redefinir Senha</h1>
        <p id="message">Abrindo o Arena Excel...</p>
        <div class="spinner" id="spinner"></div>
        <a href="${deepLink}" class="btn" id="openBtn" style="display:none;">Abrir Arena Excel</a>
        <p class="help-text" id="help" style="display:none;">
          Se o app não abrir automaticamente, clique no botão acima.<br>
          Certifique-se de que o Arena Excel está instalado.
        </p>
      </div>
      
      <script>
        setTimeout(() => {
          window.location.href = '${deepLink}';
        }, 500);
        
        setTimeout(() => {
          document.getElementById('spinner').style.display = 'none';
          document.getElementById('message').textContent = 'Clique no botão para abrir o app:';
          document.getElementById('openBtn').style.display = 'inline-block';
          document.getElementById('help').style.display = 'block';
        }, 3000);
      </script>
    </body>
    </html>
    `;
        return res.send(html);
    }
    async resetPassword(resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
    async googleAuth(redirectUri, res) {
        try {
            if (!redirectUri) {
                throw new common_1.HttpException('redirect_uri é obrigatório', common_1.HttpStatus.BAD_REQUEST);
            }
            const { authUrl } = await this.authService.googleAuth(redirectUri);
            return res.redirect(authUrl);
        }
        catch (error) {
            const message = error?.message ?? 'Erro ao iniciar autenticação Google';
            return res.redirect(`${redirectUri}?error=${encodeURIComponent(message)}`);
        }
    }
    async googleCallback(query, res) {
        try {
            if (query?.error) {
                throw new common_1.HttpException(query?.error === 'access_denied'
                    ? 'Acesso negado pelo usuário'
                    : `Erro OAuth: ${query?.error}`, common_1.HttpStatus.BAD_REQUEST);
            }
            if (!query?.code || !query?.state) {
                throw new common_1.HttpException('Parâmetros inválidos', common_1.HttpStatus.BAD_REQUEST);
            }
            const { token, user } = await this.authService.googleCallback(query.code, query.state);
            const appScheme = process.env.APP_SCHEME ?? 'abacusai1771126748';
            const userEncoded = encodeURIComponent(JSON.stringify(user));
            const deepLink = `${appScheme}://auth/callback?token=${token}&user=${userEncoded}`;
            const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login com Google - Arena Excel</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1E88E5 0%, #1565C0 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            text-align: center;
          }
          .logo { font-size: 64px; margin-bottom: 20px; }
          h1 { color: #333; margin-bottom: 20px; font-size: 24px; }
          p { color: #666; margin-bottom: 30px; line-height: 1.6; }
          .success { color: #4CAF50; font-weight: 600; }
          .btn {
            background: #1E88E5;
            color: white;
            padding: 16px 40px;
            border-radius: 8px;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            font-weight: 600;
            transition: background 0.3s;
          }
          .btn:hover { background: #1565C0; }
          .help-text {
            margin-top: 30px;
            font-size: 14px;
            color: #999;
          }
          .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #4CAF50;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🐯</div>
          <h1 class="success">✓ Login realizado!</h1>
          <p id="message">Abrindo o Arena Excel...</p>
          <div class="spinner" id="spinner"></div>
          <a href="${deepLink}" class="btn" id="openBtn" style="display:none;">Abrir Arena Excel</a>
          <p class="help-text" id="help" style="display:none;">
            Se o app não abrir automaticamente, clique no botão acima.
          </p>
        </div>
        
        <script>
          setTimeout(() => {
            window.location.href = '${deepLink}';
          }, 500);
          
          setTimeout(() => {
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('message').textContent = 'Clique no botão para abrir o app:';
            document.getElementById('openBtn').style.display = 'inline-block';
            document.getElementById('help').style.display = 'block';
          }, 3000);
        </script>
      </body>
      </html>
      `;
            return res.send(html);
        }
        catch (error) {
            const message = error?.message ?? 'Erro ao processar callback Google';
            const appScheme = process.env.APP_SCHEME ?? 'abacusai1771126748';
            const deepLink = `${appScheme}://auth/callback?error=${encodeURIComponent(message)}`;
            const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Erro no Login - Arena Excel</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1E88E5 0%, #1565C0 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            text-align: center;
          }
          .logo { font-size: 64px; margin-bottom: 20px; }
          h1 { color: #f44336; margin-bottom: 20px; font-size: 24px; }
          p { color: #666; margin-bottom: 30px; line-height: 1.6; }
          .btn {
            background: #1E88E5;
            color: white;
            padding: 16px 40px;
            border-radius: 8px;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            font-weight: 600;
            transition: background 0.3s;
          }
          .btn:hover { background: #1565C0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">⚠️</div>
          <h1>Erro no Login</h1>
          <p>${message}</p>
          <a href="${deepLink}" class="btn">Voltar para o App</a>
        </div>
      </body>
      </html>
      `;
            return res.send(html);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully registered' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User successfully logged in' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Request password reset' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password reset email sent' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Get)('reset-password-page'),
    (0, swagger_1.ApiOperation)({ summary: 'HTML page that opens app via deep link' }),
    (0, swagger_1.ApiQuery)({ name: 'token', required: true, description: 'Reset password token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'HTML page with deep link' }),
    __param(0, (0, common_1.Query)('token')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPasswordPage", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password with token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password successfully reset' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate Google OAuth flow' }),
    (0, swagger_1.ApiQuery)({ name: 'redirect_uri', required: true, description: 'Client redirect URI after auth' }),
    (0, swagger_1.ApiResponse)({ status: 302, description: 'Redirects to Google OAuth consent screen' }),
    __param(0, (0, common_1.Query)('redirect_uri')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, swagger_1.ApiOperation)({ summary: 'Google OAuth callback - Returns HTML with deep link' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'HTML page with deep link' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [google_callback_dto_1.GoogleCallbackDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map