import { Module } from '@nestjs/common';
import { PagamentoController } from './payment.controller';
import { PagamentoService } from './payment.service';
import { PagamentoRepository } from './payment.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PagamentoController],
  providers: [PagamentoService, PagamentoRepository, PrismaService],
})
export class PagamentoModule {}
