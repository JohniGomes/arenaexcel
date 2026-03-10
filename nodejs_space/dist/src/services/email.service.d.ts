export declare class EmailService {
    private readonly logger;
    private resend;
    private emailFrom;
    constructor();
    sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
}
