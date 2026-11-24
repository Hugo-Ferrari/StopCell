import { Module } from '@nestjs/common';
import { PecaController } from './peca.controller';
import { PecaService } from './peca.service';
import { PecaRepository } from './peca.repository';

@Module({
  controllers: [PecaController],
  providers: [PecaService, PecaRepository],
})
export class PecaModule {}
