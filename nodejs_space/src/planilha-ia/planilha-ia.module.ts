import { Module } from '@nestjs/common';
import { PlanilhaIAService } from './planilha-ia.service';
import { PlanilhaIAController } from './planilha-ia.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PlanilhaIAController],
  providers: [PlanilhaIAService],
})
export class PlanilhaIAModule {}
