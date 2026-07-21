import { Module } from '@nestjs/common';
import { DiagnosticoController } from './diagnostico.controller';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoRepository } from './diagnostico.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DiagnosticoController],
  providers: [DiagnosticoService, DiagnosticoRepository, PrismaService],
})
export class DiagnosticoModule {}
