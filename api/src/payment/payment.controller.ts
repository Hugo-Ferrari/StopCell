import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PagamentoService } from './payment.service';
import { PagamentoDto } from '@/type/payment.dto';
import { Permissao } from '@/common/decorators/permissao.decorator'; // <- novo
import { PERMISSOES } from '@/common/permissoes/catalogo'; // <- novo

@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly service: PagamentoService) {}

  // quem atende a OS recebe o pagamento no balcão
  @Permissao(PERMISSOES.ORDENS_EDITAR) // <- novo
  @Post()
  registrar(@Body() dto: PagamentoDto, @Req() req: any) {
    return this.service.registrar(dto, req.userCnpjEmpresa);
  }

  // listar todos os pagamentos já é relatório financeiro
  @Permissao(PERMISSOES.FINANCEIRO_VER) // <- novo
  @Get()
  buscaPagamento(@Req() req: any) {
    return this.service.listarPagamento(req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.FINANCEIRO_VER) // <- novo
  @Get(':idPagamento')
  buscarDetalhesDoPagamento(
    @Param('idPagamento', ParseIntPipe) idPagamento: number,
    @Req() req: any,
  ) {
    return this.service.buscarPorId(idPagamento, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ORDENS_VER, PERMISSOES.HISTORICO_VER, PERMISSOES.FINANCEIRO_VER) // <- novo
  @Get('os/:numOs')
  listarPagamentoOs(
    @Param('numOs', ParseIntPipe) numOs: number,
    @Req() req: any,
  ) {
    return this.service.listarPorOs(numOs, req.userCnpjEmpresa);
  }
}