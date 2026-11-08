import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { PecaService } from './peca.service';
import { PecaDto } from '@/type/peca.dto';
import { Permissao } from '@/common/decorators/permissao.decorator';
import { PERMISSOES } from '@/common/permissoes/catalogo';

// a tela de O.S. não usa mais essas rotas (o item guarda a própria descrição).
// ficaram aqui por causa das peças antigas que já estão no banco
@Controller('peca')
export class PecaController {
  constructor(private readonly service: PecaService) {}

  @Permissao(PERMISSOES.ESTOQUE_EDITAR)
  @Post()
  cadastrar(@Body() peca: PecaDto, @Req() req: any) {
    return this.service.cadastrar(peca, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ESTOQUE_EDITAR)
  @Put(':id')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() peca: PecaDto, @Req() req: any) {
    return this.service.atualizar(id, peca, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ESTOQUE_VER, PERMISSOES.ORDENS_EDITAR)
  @Get()
  listar(@Req() req: any) {
    return this.service.listar(req.userCnpjEmpresa);
  }
}