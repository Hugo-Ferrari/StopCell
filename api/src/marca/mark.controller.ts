import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MarcaService } from './mark.service';
import { MarcaDto } from '@/type/mark.dto';
import { Permissao } from '@/common/decorators/permissao.decorator';
import { PERMISSOES } from '@/common/permissoes/catalogo';

@Controller('marca')
export class MarcaController {
  constructor(private readonly service: MarcaService) {}

  @Permissao(PERMISSOES.ORDENS_EDITAR, PERMISSOES.ESTOQUE_EDITAR)
  @Post()
  cadastrar(@Body() dto: MarcaDto) {
    return this.service.cadastrar(dto);
  }

  // sem etiqueta: qualquer usuário logado pode buscar marca
  @Get(':nome')
  listarPorNomes(@Param('nome') nome: string) {
    return this.service.listarPorNomes(nome);
  }
}