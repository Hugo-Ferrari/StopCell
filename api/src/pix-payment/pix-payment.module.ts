import { Module } from '@nestjs/common';
import { PagamentoPixController } from './pix-payment.controller';
import { PagamentoPixService } from './pix-payment.service';
import { PagamentoPixRepository } from './pix-payment.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PagamentoPixController],
  providers: [PagamentoPixService, PagamentoPixRepository, PrismaService],
})
export class PagamentoPixModule {}
