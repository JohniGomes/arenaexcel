import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GoogleCallbackDto } from './dto/google-callback.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    resetPasswordPage(token: string, res: Response): Promise<Response<any, Record<string, any>>>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    googleAuth(redirectUri: string, res: Response): Promise<void>;
    googleCallback(query: GoogleCallbackDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
