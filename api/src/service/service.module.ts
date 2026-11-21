import { Module } from '@nestjs/common';
import { ServicoController } from './service.controller';
import { ServicoService } from './service.service';
import { ServicoRepository } from './service.repository';

@Module({
  controllers: [ServicoController],
  providers: [ServicoService, ServicoRepository],
})
export class ServicoModule {}
