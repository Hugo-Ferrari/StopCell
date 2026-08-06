import { Module } from '@nestjs/common';
import { ClientesController } from './customer.controller';
import { ClientesService } from './costumer.service';
import { ClientesRepository } from './costumer.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ClientesController],
  providers: [ClientesService, ClientesRepository, PrismaService],
})
export class ClientesModule {}
