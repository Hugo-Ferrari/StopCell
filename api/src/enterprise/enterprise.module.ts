import { Module } from '@nestjs/common';
import { EmpresaController } from './enterprise.controller';
import { EmpresaService } from './enterprise.service';
import { EmpresaRepository } from './enterprise.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [EmpresaController],
  providers: [EmpresaService, EmpresaRepository, PrismaService],
})
export class EmpresaModule {}
