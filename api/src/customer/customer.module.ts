import { Module } from '@nestjs/common';
import { ClientesController } from './customer.controller';
import { ClientesService } from './customer.service';
import { ClientesRepository } from './customer.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ClientesController],
  providers: [ClientesService, ClientesRepository, PrismaService],
})
export class ClientesModule {}
