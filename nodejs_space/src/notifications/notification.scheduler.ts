import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationScheduler {
  constructor(private readonly notificationService: NotificationService) {}

  // Bom dia todo dia às 8h
  @Cron('0 8 * * *')
  async morningMotivation() {
    await this.notificationService.sendMorningMotivation();
  }

  // Streak em risco todo dia às 21h
  @Cron('0 21 * * *')
  async streakAlert() {
    await this.notificationService.checkStreakAtRisk();
  }

  // Verifica inativos todo dia ao meio-dia
  @Cron('0 12 * * *')
  async inactivityCheck() {
    await this.notificationService.checkInactiveUsers();
  }

  // Dica do dia às 12h toda quarta-feira
  @Cron('0 12 * * 3')
  async dailyTip() {
    await this.notificationService.sendDailyTip();
  }
}
