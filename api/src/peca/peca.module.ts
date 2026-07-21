import { Module } from '@nestjs/common';
import { PecaController } from './peca.controller';
import { PecaService } from './peca.service';
import { PecaRepository } from './peca.reposiotory';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PecaController],
  providers: [PecaService, PecaRepository, PrismaService],
})
export class PecaModule {}
