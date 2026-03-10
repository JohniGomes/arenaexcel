export declare class GoogleOAuthService {
    private readonly logger;
    private oauth2Client;
    private readonly clientId;
    private readonly clientSecret;
    constructor();
    generateAuthUrl(redirectUri: string): string;
    verifyAuthCode(code: string, state: string): Promise<{
        email: string;
        name: string;
        googleId: string;
        redirectUri: string;
    }>;
    private signState;
    private verifyState;
}
