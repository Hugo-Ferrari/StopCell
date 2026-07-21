import { Module } from '@nestjs/common';
import { PagamentoPixController } from './pagamento-pix.controller';
import { PagamentoPixService } from './pagamento-pix.service';
import { PagamentoPixRepository } from './pagamentoPix.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PagamentoPixController],
  providers: [PagamentoPixService, PagamentoPixRepository, PrismaService],
})
export class PagamentoPixModule {}
