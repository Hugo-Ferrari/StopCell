import { Module } from '@nestjs/common';
import { AparelhoController } from './device.controller';
import { AparelhoService } from './device.service';
import { AparelhoRepository } from './device.repository';

@Module({
  controllers: [AparelhoController],
  providers: [AparelhoService, AparelhoRepository],
})
export class AparelhoModule {}
