import { Module } from '@nestjs/common';
import { OrdemServicoController } from './ordem-servico.controller';
import { OrdemServicoService } from './ordem-servico.service';
import { OrdemServicoRepository } from './ordemServico.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [OrdemServicoController],
  providers: [OrdemServicoService, OrdemServicoRepository, PrismaService],
})
export class OrdemServicoModule {}
