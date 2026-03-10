"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../services/email.service");
const google_oauth_service_1 = require("../services/google-oauth.service");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    emailService;
    googleOAuthService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwtService, emailService, googleOAuthService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.googleOAuthService = googleOAuthService;
    }
    async register(registerDto) {
        try {
            const existingUser = await this.prisma.users.findUnique({
                where: { email: registerDto.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email already registered');
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
        }
        catch (error) {
            this.logger.error(`Registration error: ${error.message}`, error.stack);
            throw error;
        }
    }
    async login(loginDto) {
        try {
            const user = await this.prisma.users.findUnique({
                where: { email: loginDto.email },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            if (!user.passwordhash) {
                throw new common_1.UnauthorizedException('Esta conta foi criada com Google. Use "Login com Google" para acessar.');
            }
            const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordhash);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
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
        }
        catch (error) {
            this.logger.error(`Login error: ${error.message}`, error.stack);
            throw error;
        }
    }
    async forgotPassword(forgotPasswordDto) {
        try {
            const user = await this.prisma.users.findUnique({
                where: { email: forgotPasswordDto.email },
            });
            if (user) {
                if (!user.passwordhash) {
                    this.logger.log(`Reset solicitado para conta Google: ${forgotPasswordDto.email}`);
                }
                else {
                    const resetToken = (0, crypto_1.randomBytes)(32).toString('hex');
                    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
                    await this.prisma.users.update({
                        where: { id: user.id },
                        data: {
                            resettoken: resetToken,
                            resettokenexpires: resetTokenExpires,
                        },
                    });
                    await this.emailService.sendPasswordResetEmail(user.email, resetToken);
                    this.logger.log(`Reset token gerado para: ${user.email}`);
                }
            }
            return {
                message: 'Se o e-mail existir, você receberá um link de redefinição de senha.',
            };
        }
        catch (error) {
            this.logger.error(`Forgot password error: ${error?.message ?? 'Erro desconhecido'}`, error?.stack);
            throw error;
        }
    }
    async resetPassword(resetPasswordDto) {
        try {
            const user = await this.prisma.users.findUnique({
                where: { resettoken: resetPasswordDto.token },
            });
            if (!user || !user.resettokenexpires) {
                throw new common_1.BadRequestException('Token inválido ou expirado');
            }
            if (new Date() > user.resettokenexpires) {
                throw new common_1.BadRequestException('Token expirado. Solicite um novo reset.');
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
        }
        catch (error) {
            this.logger.error(`Reset password error: ${error?.message ?? 'Erro desconhecido'}`, error?.stack);
            throw error;
        }
    }
    async googleAuth(redirectUri) {
        try {
            const authUrl = this.googleOAuthService.generateAuthUrl(redirectUri);
            return { authUrl };
        }
        catch (error) {
            this.logger.error(`Google auth error: ${error?.message ?? 'Erro desconhecido'}`, error?.stack);
            throw error;
        }
    }
    async googleCallback(code, state) {
        try {
            const { email, name, googleId, redirectUri } = await this.googleOAuthService.verifyAuthCode(code, state);
            let user = await this.prisma.users.findFirst({
                where: {
                    OR: [{ email }, { googleid: googleId }],
                },
            });
            if (user) {
                user = await this.prisma.users.update({
                    where: { id: user.id },
                    data: {
                        googleid: googleId,
                        lastLoginAt: new Date(),
                    },
                });
                this.logger.log(`Google login: ${user.email}`);
            }
            else {
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
        }
        catch (error) {
            this.logger.error(`Google callback error: ${error?.message ?? 'Erro desconhecido'}`, error?.stack);
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService,
        google_oauth_service_1.GoogleOAuthService])
], AuthService);
//# sourceMappingURL=auth.service.js.map