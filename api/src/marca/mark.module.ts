import { Module } from '@nestjs/common';
import { MarcaController } from './mark.controller';
import { MarcaService } from './mark.service';
import { MarcaRepository } from './mark.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MarcaController],
  providers: [MarcaService, MarcaRepository, PrismaService],
})
export class MarcaModule {}
