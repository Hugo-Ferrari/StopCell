import { Module } from '@nestjs/common';
import { PagamentoCartaoController } from './pagamento-cartao.controller';
import { PagamentoCartaoService } from './pagamento-cartao.service';
import { PagamentoCartaoRepository } from './pagamentoCartao.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PagamentoCartaoController],
  providers: [PagamentoCartaoService, PagamentoCartaoRepository, PrismaService],
})
export class PagamentoCartaoModule {}
