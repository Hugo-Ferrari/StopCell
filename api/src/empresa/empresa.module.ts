import { Module } from '@nestjs/common';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';
import { EmpresaRepository } from './empresa.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [EmpresaController],
  providers: [EmpresaService, EmpresaRepository, PrismaService],
})
export class EmpresaModule {}
