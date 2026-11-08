import { Controller, Post, Body, Put, Param, ParseIntPipe, Req } from '@nestjs/common';
import { ServicoService } from './service.service';
import { ServicoDto } from '@/type/service.dto';
import { Permissao } from '@/common/decorators/permissao.decorator';
import { PERMISSOES } from '@/common/permissoes/catalogo';

@Controller('servico')
export class ServicoController {
  constructor(private readonly servicoService: ServicoService) {}

  @Permissao(PERMISSOES.ORDENS_EDITAR, PERMISSOES.ESTOQUE_EDITAR)
  @Post()
  cadastrar(@Body() servico: ServicoDto, @Req() req: any) {
    return this.servicoService.cadastrar(servico, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ESTOQUE_EDITAR)
  @Put(':id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() servico: ServicoDto,
    @Req() req: any,
  ) {
    return this.servicoService.atualizar(id, servico, req.userCnpjEmpresa);
  }
}