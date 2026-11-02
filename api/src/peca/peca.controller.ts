import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { PecaService } from './peca.service';
import { PecaDto } from '@/type/peca.dto';
import { Permissao } from '@/common/decorators/permissao.decorator'; // <- novo
import { PERMISSOES } from '@/common/permissoes/catalogo'; // <- novo

@Controller('peca')
export class PecaController {
  constructor(private readonly service: PecaService) {}

  @Permissao(PERMISSOES.ESTOQUE_EDITAR) // <- novo
  @Post()
  cadastrar(@Body() peca: PecaDto, @Req() req: any) {
    return this.service.cadastrar(peca, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ESTOQUE_EDITAR) // <- novo
  @Put(':id')
  atualizar(@Param('id') id: number, @Body() peca: PecaDto, @Req() req: any) {
    return this.service.atualizar(id, peca, req.userCnpjEmpresa);
  }

  // o técnico precisa listar as peças pra usar na OS, mesmo sem acesso ao estoque
  @Permissao(PERMISSOES.ESTOQUE_VER, PERMISSOES.ORDENS_EDITAR) // <- novo
  @Get()
  listar(@Req() req: any) {
    return this.service.listar(req.userCnpjEmpresa);
  }
}