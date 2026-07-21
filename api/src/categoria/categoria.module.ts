import { Module } from '@nestjs/common';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';
import { categoriaRepository } from './categoria.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService, categoriaRepository, PrismaService],
})
export class CategoriaModule {}
