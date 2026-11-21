import { Module } from '@nestjs/common';
import { OsChecklistController } from './os-checklist.controller';
import { OsChecklistService } from './os-checklist.service';
import { OsChecklistRepository } from './os-checklist.repository';

@Module({
  controllers: [OsChecklistController],
  providers: [OsChecklistService, OsChecklistRepository],
})
export class OsChecklistModule {}
