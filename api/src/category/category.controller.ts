import { Body, Controller, Post } from '@nestjs/common';
import { CategoriaService } from './category.service';
import { categoriaDto } from '@/type/category.dto';
import { Permissao } from '@/common/decorators/permissao.decorator';
import { PERMISSOES } from '@/common/permissoes/catalogo';

@Controller('categoria')
export class CategoriaController {
  constructor(private readonly service: CategoriaService) {}

  @Permissao(PERMISSOES.ORDENS_EDITAR, PERMISSOES.ESTOQUE_EDITAR)
  @Post()
  cadastrar(@Body() dto: categoriaDto) {
    return this.service.cadastrar(dto);
  }
}