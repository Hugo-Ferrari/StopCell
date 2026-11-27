import { Body, Controller, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { CategoriaService } from './category.service';
import { categoriaDto } from '@/type/category.dto';
import { Permissao } from '@/common/decorators/permissao.decorator';
import { PERMISSOES } from '@/common/permissoes/catalogo';

@Controller('categoria')
export class CategoriaController {
  constructor(private readonly service: CategoriaService) {}

  @Permissao(PERMISSOES.ORDENS_EDITAR, PERMISSOES.ESTOQUE_EDITAR)
  @Post()
  cadastrar(@Body() dto: categoriaDto, @Req() req: any) {
    return this.service.cadastrar(dto, req.userCnpjEmpresa);
  }

  // só altera categoria criada pela própria loja; as padrão do sistema ficam travadas
  @Permissao(PERMISSOES.ORDENS_EDITAR, PERMISSOES.ESTOQUE_EDITAR)
  @Put(':id')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: categoriaDto, @Req() req: any) {
    return this.service.atualizar(id, dto, req.userCnpjEmpresa);
  }
}