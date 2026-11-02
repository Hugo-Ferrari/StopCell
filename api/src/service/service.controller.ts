import { Controller, Post, Body, Put, Param, Req } from '@nestjs/common';
import { ServicoService } from './service.service';
import { ServicoDto } from '@/type/service.dto';
import { Permissao } from '@/common/decorators/permissao.decorator'; // <- novo
import { PERMISSOES } from '@/common/permissoes/catalogo'; // <- novo

@Controller('servico')
export class ServicoController {
  constructor(private readonly servicoService: ServicoService) {}

  // a tela de detalhes da OS cadastra serviço, por isso aceita ORDENS_EDITAR também
  @Permissao(PERMISSOES.ORDENS_EDITAR, PERMISSOES.ESTOQUE_EDITAR) // <- novo
  @Post()
  cadastrar(@Body() servico: ServicoDto, @Req() req: any) {
    return this.servicoService.cadastrar(servico, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ESTOQUE_EDITAR) // <- novo
  @Put(':id')
  atualizar(
    @Param('id') id: number,
    @Body() servico: ServicoDto,
    @Req() req: any,
  ) {
    return this.servicoService.atualizar(id, servico, req.userCnpjEmpresa);
  }
}