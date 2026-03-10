import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProgressModule } from './progress/progress.module';
import { ExercisesModule } from './exercises/exercises.module';
import { MissionsModule } from './missions/missions.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { AchievementsModule } from './achievements/achievements.module';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notifications/notification.module';
import { NotificationScheduler } from './notifications/notification.scheduler';
import { PlanilhaIAModule } from './planilha-ia/planilha-ia.module';
import { BadgesModule } from './badges/badges.module';
import { TrailsModule } from './trails/trails.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    ProgressModule,
    ExercisesModule,
    MissionsModule,
    LeaderboardModule,
    AchievementsModule,
    ChatModule,
    NotificationModule,
    PlanilhaIAModule,
    BadgesModule,
    TrailsModule,
  ],
  providers: [NotificationScheduler],
})
export class AppModule {}