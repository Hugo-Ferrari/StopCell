import { Module } from '@nestjs/common';
import { PagamentoController } from './payment.controller';
import { PagamentoService } from './payment.service';
import { PagamentoRepository } from './payment.repository';

@Module({
  controllers: [PagamentoController],
  providers: [PagamentoService, PagamentoRepository],
})
export class PagamentoModule {}
