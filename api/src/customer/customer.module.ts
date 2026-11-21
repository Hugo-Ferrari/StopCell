import { Module } from '@nestjs/common';
import { ClientesController } from './customer.controller';
import { ClientesService } from './customer.service';
import { ClientesRepository } from './customer.repository';

@Module({
  controllers: [ClientesController],
  providers: [ClientesService, ClientesRepository],
})
export class ClientesModule {}
