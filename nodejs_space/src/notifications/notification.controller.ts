import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationService } from './notification.service';

@Controller('api/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('token')
  @UseGuards(JwtAuthGuard)
  async saveToken(@Request() req: any, @Body() body: { token: string }) {
    await this.notificationService.savePushToken(req.user.id, body.token);
    return { success: true };
  }
}
