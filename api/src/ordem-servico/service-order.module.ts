import { Module } from '@nestjs/common';
import { OrdemServicoController } from './service-order.controller';
import { OrdemServicoService } from './service-order.service';
import { OrdemServicoRepository } from './service-order.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [OrdemServicoController],
  providers: [OrdemServicoService, OrdemServicoRepository, PrismaService],
})
export class OrdemServicoModule {}
