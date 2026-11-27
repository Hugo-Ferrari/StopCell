import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { MarcaService } from './mark.service';
import { MarcaDto } from '@/type/mark.dto';
import { Permissao } from '@/common/decorators/permissao.decorator';
import { PERMISSOES } from '@/common/permissoes/catalogo';

@Controller('marca')
export class MarcaController {
  constructor(private readonly service: MarcaService) {}

  @Permissao(PERMISSOES.ORDENS_EDITAR, PERMISSOES.ESTOQUE_EDITAR)
  @Post()
  cadastrar(@Body() dto: MarcaDto, @Req() req: any) {
    return this.service.cadastrar(dto, req.userCnpjEmpresa);
  }

  // só altera marca criada pela própria loja; as padrão do sistema ficam travadas
  @Permissao(PERMISSOES.ORDENS_EDITAR, PERMISSOES.ESTOQUE_EDITAR)
  @Put(':id')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: MarcaDto, @Req() req: any) {
    return this.service.atualizar(id, dto, req.userCnpjEmpresa);
  }

  // sem etiqueta: qualquer usuário logado pode buscar marca (as padrão e as da loja dele)
  @Get(':nome')
  listarPorNomes(@Param('nome') nome: string, @Req() req: any) {
    return this.service.listarPorNomes(nome, req.userCnpjEmpresa);
  }
}