import { Module } from '@nestjs/common';
import { MarcaController } from './marca.controller';
import { MarcaService } from './marca.service';
import { MarcaRepository } from './marca.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MarcaController],
  providers: [MarcaService, MarcaRepository, PrismaService],
})
export class MarcaModule {}
