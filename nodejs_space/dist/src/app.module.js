"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const progress_module_1 = require("./progress/progress.module");
const exercises_module_1 = require("./exercises/exercises.module");
const missions_module_1 = require("./missions/missions.module");
const leaderboard_module_1 = require("./leaderboard/leaderboard.module");
const achievements_module_1 = require("./achievements/achievements.module");
const chat_module_1 = require("./chat/chat.module");
const notification_module_1 = require("./notifications/notification.module");
const notification_scheduler_1 = require("./notifications/notification.scheduler");
const planilha_ia_module_1 = require("./planilha-ia/planilha-ia.module");
const badges_module_1 = require("./badges/badges.module");
const trails_module_1 = require("./trails/trails.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            progress_module_1.ProgressModule,
            exercises_module_1.ExercisesModule,
            missions_module_1.MissionsModule,
            leaderboard_module_1.LeaderboardModule,
            achievements_module_1.AchievementsModule,
            chat_module_1.ChatModule,
            notification_module_1.NotificationModule,
            planilha_ia_module_1.PlanilhaIAModule,
            badges_module_1.BadgesModule,
            trails_module_1.TrailsModule,
        ],
        providers: [notification_scheduler_1.NotificationScheduler],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map