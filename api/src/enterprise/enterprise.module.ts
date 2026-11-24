import { Module } from '@nestjs/common';
import { EmpresaController } from './enterprise.controller';
import { EmpresaService } from './enterprise.service';
import { EmpresaRepository } from './enterprise.repository';

@Module({
  controllers: [EmpresaController],
  providers: [EmpresaService, EmpresaRepository],
})
export class EmpresaModule {}
