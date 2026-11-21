import { Module } from '@nestjs/common';
import { CategoriaController } from './category.controller';
import { CategoriaService } from './category.service';
import { categoriaRepository } from './category.repository';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService, categoriaRepository],
})
export class CategoriaModule {}
