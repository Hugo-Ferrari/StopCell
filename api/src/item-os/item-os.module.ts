import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { ItemOsController } from './item-os.controller';
import { ItemOsService } from './item-os.service';
import { ItenOsRepository } from './itemOs.repository';

@Module({
    controllers: [ItemOsController],
    providers: [ItemOsService, ItenOsRepository, PrismaService],
})
export class ItensOsModule {}