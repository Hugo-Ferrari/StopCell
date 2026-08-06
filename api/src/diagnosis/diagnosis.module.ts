import { Module } from '@nestjs/common';
import { DiagnosticoController } from './diagnosis.controller';
import { DiagnosticoService } from './diagnosis.service';
import { DiagnosticoRepository } from './diagnosis.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DiagnosticoController],
  providers: [DiagnosticoService, DiagnosticoRepository, PrismaService],
})
export class DiagnosticoModule {}
