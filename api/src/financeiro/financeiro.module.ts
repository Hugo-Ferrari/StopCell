import { Module } from '@nestjs/common';
import { FinanceiroController } from './financeiro.controller';
import { FinanceiroRepository } from './financeiro.repository';
import { FinanceiroService } from './financeiro.service';
import { PainelFinanceiroRepository } from './painel-financeiro.repository';
import { PainelFinanceiroService } from './painel-financeiro.service';

@Module({
  controllers: [FinanceiroController],
  providers: [
    FinanceiroService,
    FinanceiroRepository,
    PainelFinanceiroService,
    PainelFinanceiroRepository,
  ],
})
export class FinanceiroModule {}