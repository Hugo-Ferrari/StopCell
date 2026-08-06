import { Module } from '@nestjs/common';
import { ServicoController } from './service.controller';
import { ServicoService } from './service.service';
import { ServicoRepository } from './service.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ServicoController],
  providers: [ServicoService, ServicoRepository, PrismaService],
})
export class ServicoModule {}
