import { Module } from '@nestjs/common';
import { PagamentoController } from './pagamento.controller';
import { PagamentoService } from './pagamento.service';
import { PagamentoRepository } from './pagamento.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PagamentoController],
  providers: [PagamentoService, PagamentoRepository, PrismaService],
})
export class PagamentoModule {}
