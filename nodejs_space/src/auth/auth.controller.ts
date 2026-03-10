import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query, Res, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GoogleCallbackDto } from './dto/google-callback.dto';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Get('reset-password-page')
  @ApiOperation({ summary: 'HTML page that opens app via deep link' })
  @ApiQuery({ name: 'token', required: true, description: 'Reset password token' })
  @ApiResponse({ status: 200, description: 'HTML page with deep link' })
  async resetPasswordPage(@Query('token') token: string, @Res() res: Response) {
    // Retorna HTML que abre o app via deep link (funciona tanto no Expo Go quanto no app instalado)
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

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password successfully reset' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  @ApiQuery({ name: 'redirect_uri', required: true, description: 'Client redirect URI after auth' })
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth consent screen' })
  async googleAuth(@Query('redirect_uri') redirectUri: string, @Res() res: Response) {
    try {
      if (!redirectUri) {
        throw new HttpException('redirect_uri é obrigatório', HttpStatus.BAD_REQUEST);
      }

      const { authUrl } = await this.authService.googleAuth(redirectUri);
      return res.redirect(authUrl);
    } catch (error) {
      const message = error?.message ?? 'Erro ao iniciar autenticação Google';
      return res.redirect(`${redirectUri}?error=${encodeURIComponent(message)}`);
    }
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback - Returns HTML with deep link' })
  @ApiResponse({ status: 200, description: 'HTML page with deep link' })
  async googleCallback(@Query() query: GoogleCallbackDto, @Res() res: Response) {
    try {
      if (query?.error) {
        throw new HttpException(
          query?.error === 'access_denied'
            ? 'Acesso negado pelo usuário'
            : `Erro OAuth: ${query?.error}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!query?.code || !query?.state) {
        throw new HttpException('Parâmetros inválidos', HttpStatus.BAD_REQUEST);
      }

      const { token, user } = await this.authService.googleCallback(
        query.code,
        query.state,
      );

      // Cria deep link com token e user
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
    } catch (error) {
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
}