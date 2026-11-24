import { Module } from '@nestjs/common';
import { DiagnosticoController } from './diagnosis.controller';
import { DiagnosticoService } from './diagnosis.service';
import { DiagnosticoRepository } from './diagnosis.repository';

@Module({
  controllers: [DiagnosticoController],
  providers: [DiagnosticoService, DiagnosticoRepository],
})
export class DiagnosticoModule {}
