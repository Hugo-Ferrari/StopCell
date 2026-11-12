import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FinanceiroController } from './financeiro.controller';
import { FinanceiroRepository } from './financeiro.repository';
import { FinanceiroService } from './financeiro.service';

@Module({
  controllers: [FinanceiroController],
  providers: [FinanceiroService, FinanceiroRepository, PrismaService],
})
export class FinanceiroModule {}
