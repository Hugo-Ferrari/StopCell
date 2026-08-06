import { Module } from '@nestjs/common';
import { CategoriaController } from './category.controller';
import { CategoriaService } from './category.service';
import { categoriaRepository } from './category.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService, categoriaRepository, PrismaService],
})
export class CategoriaModule {}
