import { Module } from '@nestjs/common';
import { OsChecklistController } from './os-checklist.controller';
import { OsChecklistService } from './os-checklist.service';
import { OsChecklistRepository } from './os-checklist.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [OsChecklistController],
  providers: [OsChecklistService, OsChecklistRepository, PrismaService],
})
export class OsChecklistModule {}
