import { Module } from '@nestjs/common';
import { AparelhoController } from './aparelho.controller';
import { AparelhoService } from './aparelho.service';
import { AparelhoRepository } from './aparelho.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AparelhoController],
  providers: [AparelhoService, AparelhoRepository, PrismaService],
})
export class AparelhoModule {}
