import { Module } from '@nestjs/common';

import { ItemOsController } from './item-os.controller';
import { ItemOsService } from './item-os.service';
import { ItemOsRepository } from './item-os.repository';

@Module({
    controllers: [ItemOsController],
    providers: [ItemOsService, ItemOsRepository],
})
export class ItensOsModule {}