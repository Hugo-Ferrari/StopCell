import { Module } from '@nestjs/common';
import { AparelhoController } from './device.controller';
import { AparelhoService } from './device.service';
import { AparelhoRepository } from './device.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AparelhoController],
  providers: [AparelhoService, AparelhoRepository, PrismaService],
})
export class AparelhoModule {}
