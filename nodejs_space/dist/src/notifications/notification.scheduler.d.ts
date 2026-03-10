import { NotificationService } from './notification.service';
export declare class NotificationScheduler {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    morningMotivation(): Promise<void>;
    streakAlert(): Promise<void>;
    inactivityCheck(): Promise<void>;
    dailyTip(): Promise<void>;
}
