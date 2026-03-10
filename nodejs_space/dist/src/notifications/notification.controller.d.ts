import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    saveToken(req: any, body: {
        token: string;
    }): Promise<{
        success: boolean;
    }>;
}
