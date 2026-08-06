import { Module } from '@nestjs/common';
import { PagamentoCartaoController } from './card-payment.controller';
import { PagamentoCartaoService } from './card-payment.service';
import { PagamentoCartaoRepository } from './card-payment.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PagamentoCartaoController],
  providers: [PagamentoCartaoService, PagamentoCartaoRepository, PrismaService],
})
export class PagamentoCartaoModule {}
