import { Module } from '@nestjs/common';
import { ClientesController } from './cliente.controller';
import { ClientesService } from './cliente.service';
import { ClientesRepository } from './cliente.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ClientesController],
  providers: [ClientesService, ClientesRepository, PrismaService],
})
export class ClientesModule {}
