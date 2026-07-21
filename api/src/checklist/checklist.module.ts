import { Module } from '@nestjs/common';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { ChecklistRepository } from './checklist.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ChecklistController],
  providers: [ChecklistService, ChecklistRepository, PrismaService],
})
export class ChecklistModule {}
