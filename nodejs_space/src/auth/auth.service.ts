import { Injectable, ConflictException, UnauthorizedException, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../services/email.service';
import { GoogleOAuthService } from '../services/google-oauth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private googleOAuthService: GoogleOAuthService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const existingUser = await this.prisma.users.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = await this.prisma.users.create({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          passwordhash: hashedPassword,
        },
      });

      const token = this.jwtService.sign({ sub: user.id, email: user.email });

      this.logger.log(`User registered: ${user.email}`);

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          level: user.level,
          xp: user.xp,
        },
      };
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email: loginDto.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.passwordhash) {
        throw new UnauthorizedException(
          'Esta conta foi criada com Google. Use "Login com Google" para acessar.',
        );
      }

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordhash);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Atualiza lastLoginAt
      await this.prisma.users.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      const token = this.jwtService.sign({ sub: user.id, email: user.email });

      this.logger.log(`User logged in: ${user.email}`);

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          level: user.level,
          xp: user.xp,
          onboardingCompleted: user.onboardingCompleted,
        },
      };
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email: forgotPasswordDto.email },
      });

      if (user) {
        if (!user.passwordhash) {
          // Conta criada com Google, não pode resetar senha
          this.logger.log(
            `Reset solicitado para conta Google: ${forgotPasswordDto.email}`,
          );
        } else {
          // Gera token de reset (válido por 1 hora)
          const resetToken = randomBytes(32).toString('hex');
          const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

          await this.prisma.users.update({
            where: { id: user.id },
            data: {
              resettoken: resetToken,
              resettokenexpires: resetTokenExpires,
            },
          });

          // Envia e-mail
          await this.emailService.sendPasswordResetEmail(
            user.email,
            resetToken,
          );

          this.logger.log(`Reset token gerado para: ${user.email}`);
        }
      }

      // Sempre retorna sucesso (segurança)
      return {
        message:
          'Se o e-mail existir, você receberá um link de redefinição de senha.',
      };
    } catch (error) {
      this.logger.error(`Forgot password error: ${error?.message ?? 'Erro desconhecido'}`, error?.stack);
      throw error;
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { resettoken: resetPasswordDto.token },
      });

      if (!user || !user.resettokenexpires) {
        throw new BadRequestException('Token inválido ou expirado');
      }

      if (new Date() > user.resettokenexpires) {
        throw new BadRequestException('Token expirado. Solicite um novo reset.');
      }

      const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

      await this.prisma.users.update({
        where: { id: user.id },
        data: {
          passwordhash: hashedPassword,
          resettoken: null,
          resettokenexpires: null,
        },
      });

      this.logger.log(`Senha redefinida para: ${user.email}`);

      return {
        message: 'Senha redefinida com sucesso!',
      };
    } catch (error) {
      this.logger.error(`Reset password error: ${error?.message ?? 'Erro desconhecido'}`, error?.stack);
      throw error;
    }
  }

  async googleAuth(redirectUri: string) {
    try {
      const authUrl = this.googleOAuthService.generateAuthUrl(redirectUri);
      return { authUrl };
    } catch (error) {
      this.logger.error(`Google auth error: ${error?.message ?? 'Erro desconhecido'}`, error?.stack);
      throw error;
    }
  }

  async googleCallback(code: string, state: string) {
    try {
      const { email, name, googleId, redirectUri } =
        await this.googleOAuthService.verifyAuthCode(code, state);

      // Busca usuário existente (por e-mail ou googleId)
      let user = await this.prisma.users.findFirst({
        where: {
          OR: [{ email }, { googleid: googleId }],
        },
      });

      if (user) {
        // Usuário já existe - atualiza googleId se não tiver e lastLoginAt
        user = await this.prisma.users.update({
          where: { id: user.id },
          data: { 
            googleid: googleId,
            lastLoginAt: new Date(),
          },
        });
        this.logger.log(`Google login: ${user.email}`);
      } else {
        // Cria nova conta
        user = await this.prisma.users.create({
          data: {
            name,
            email,
            googleid: googleId,
            passwordhash: null,
            lastLoginAt: new Date(),
          },
        });
        this.logger.log(`Nova conta Google criada: ${user.email}`);
      }

      const token = this.jwtService.sign({ sub: user.id, email: user.email });

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          level: user.level,
          xp: user.xp,
          onboardingCompleted: user.onboardingCompleted,
        },
        redirectUri,
      };
    } catch (error) {
      this.logger.error(`Google callback error: ${error?.message ?? 'Erro desconhecido'}`, error?.stack);
      throw error;
    }
  }
}