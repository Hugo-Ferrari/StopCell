import { Module } from '@nestjs/common';
import { OrdemServicoController } from './service-order.controller';
import { OrdemServicoService } from './service-order.service';
import { OrdemServicoRepository } from './service-order.repository';
import { OsPdfService } from './os-pdf.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificacaoModule } from '@/notificacao/notificacao.module';

@Module({
  imports: [NotificacaoModule],
  controllers: [OrdemServicoController],
  providers: [OrdemServicoService, OrdemServicoRepository, OsPdfService, PrismaService],
})
export class OrdemServicoModule {}