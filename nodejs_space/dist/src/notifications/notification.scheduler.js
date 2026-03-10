"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const notification_service_1 = require("./notification.service");
let NotificationScheduler = class NotificationScheduler {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async morningMotivation() {
        await this.notificationService.sendMorningMotivation();
    }
    async streakAlert() {
        await this.notificationService.checkStreakAtRisk();
    }
    async inactivityCheck() {
        await this.notificationService.checkInactiveUsers();
    }
    async dailyTip() {
        await this.notificationService.sendDailyTip();
    }
};
exports.NotificationScheduler = NotificationScheduler;
__decorate([
    (0, schedule_1.Cron)('0 8 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationScheduler.prototype, "morningMotivation", null);
__decorate([
    (0, schedule_1.Cron)('0 21 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationScheduler.prototype, "streakAlert", null);
__decorate([
    (0, schedule_1.Cron)('0 12 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationScheduler.prototype, "inactivityCheck", null);
__decorate([
    (0, schedule_1.Cron)('0 12 * * 3'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationScheduler.prototype, "dailyTip", null);
exports.NotificationScheduler = NotificationScheduler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationScheduler);
//# sourceMappingURL=notification.scheduler.js.map