import { Module } from '@nestjs/common';
import { MarcaController } from './mark.controller';
import { MarcaService } from './mark.service';
import { MarcaRepository } from './mark.repository';

@Module({
  controllers: [MarcaController],
  providers: [MarcaService, MarcaRepository],
})
export class MarcaModule {}
