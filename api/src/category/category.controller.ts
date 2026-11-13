import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { CategoriaService } from './category.service';
import { categoriaDto } from '@/type/category.dto';
import { Permissao } from '@/common/decorators/permissao.decorator'; // <- novo
import { PERMISSOES } from '@/common/permissoes/catalogo'; // <- novo

@Controller('categoria')
// adicionar ligação entre categoria e empresa no PRISMA
export class CategoriaController {
  constructor(private readonly service: CategoriaService) {}

  @Permissao(PERMISSOES.ORDENS_EDITAR, PERMISSOES.ESTOQUE_EDITAR) // <- novo
  @Post()
  cadastrar(@Body() dto: categoriaDto) {
    return this.service.cadastrar(dto);
  }

  @Permissao(PERMISSOES.ORDENS_EDITAR, PERMISSOES.ESTOQUE_EDITAR) // <- novo
  @Put(':id')
  atualizar(@Param('id') id: string, @Body() dto: categoriaDto) {
    return this.service.atualizar(+id, dto);
  }
}