import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../services/email.service';
import { GoogleOAuthService } from '../services/google-oauth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private emailService;
    private googleOAuthService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, emailService: EmailService, googleOAuthService: GoogleOAuthService);
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            level: number;
            xp: number;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            level: number;
            xp: number;
            onboardingCompleted: boolean;
        };
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    googleAuth(redirectUri: string): Promise<{
        authUrl: string;
    }>;
    googleCallback(code: string, state: string): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            level: number;
            xp: number;
            onboardingCompleted: boolean;
        };
        redirectUri: string;
    }>;
}
