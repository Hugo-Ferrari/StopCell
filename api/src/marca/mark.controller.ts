import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { MarcaService } from './mark.service';
import { MarcaDto } from '@/type/mark.dto';
import { Permissao } from '@/common/decorators/permissao.decorator'; // <- novo
import { PERMISSOES } from '@/common/permissoes/catalogo'; // <- novo

@Controller('marca')
export class MarcaController {
  constructor(private readonly service: MarcaService) {}

  @Permissao(PERMISSOES.ORDENS_EDITAR, PERMISSOES.ESTOQUE_EDITAR) // <- novo
  @Post()
  cadastrar(@Body() dto: MarcaDto) {
    return this.service.cadastrar(dto);
  }

  @Permissao(PERMISSOES.ORDENS_EDITAR, PERMISSOES.ESTOQUE_EDITAR) // <- novo
  @Put(':id')
  atualizar(@Param('id') id: string, @Body() dto: MarcaDto) {
    return this.service.atualizar(+id, dto);
  }

  // sem etiqueta: qualquer usuário logado pode buscar marca
  @Get(':nome')
  listarPorNomes(@Param('nome') nome: string) {
    return this.service.listarPorNomes(nome);
  }
}