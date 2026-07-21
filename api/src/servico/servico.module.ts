import { Module } from '@nestjs/common';
import { ServicoController } from './servico.controller';
import { ServicoService } from './servico.service';
import { ServicoRepository } from './servico.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ServicoController],
  providers: [ServicoService, ServicoRepository, PrismaService],
})
export class ServicoModule {}
