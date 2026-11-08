import { Module } from '@nestjs/common';
import { PecaController } from './peca.controller';
import { PecaService } from './peca.service';
import { PecaRepository } from './peca.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PecaController],
  providers: [PecaService, PecaRepository, PrismaService],
})
export class PecaModule {}
