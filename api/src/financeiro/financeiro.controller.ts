import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Permissao } from '@/common/decorators/permissao.decorator';
import { PERMISSOES } from '@/common/permissoes/catalogo';
import {
  CriarDespesaDto,
  PeriodoQueryDto,
  SerieQueryDto,
  UltimosPagamentosQueryDto,
} from '@/type/financeiro.dto';
import { FinanceiroService } from './financeiro.service';

@Controller('financeiro')
export class FinanceiroController {
  constructor(private readonly service: FinanceiroService) {}

  @Permissao(PERMISSOES.FINANCEIRO_VER)
  @Get('resumo')
  resumo(@Query() query: PeriodoQueryDto, @Req() req: any) {
    return this.service.resumo(req.userCnpjEmpresa, query);
  }

  @Permissao(PERMISSOES.FINANCEIRO_VER)
  @Get('receitas-por-periodo')
  receitasPorPeriodo(@Query() query: SerieQueryDto, @Req() req: any) {
    return this.service.receitasPorPeriodo(req.userCnpjEmpresa, query);
  }

  @Permissao(PERMISSOES.FINANCEIRO_VER)
  @Get('receitas-por-forma-pagamento')
  receitasPorFormaPagamento(
    @Query() query: PeriodoQueryDto,
    @Req() req: any,
  ) {
    return this.service.receitasPorFormaPagamento(req.userCnpjEmpresa, query);
  }

  @Permissao(PERMISSOES.FINANCEIRO_VER)
  @Get('despesas-por-periodo')
  despesasPorPeriodo(@Query() query: SerieQueryDto, @Req() req: any) {
    return this.service.despesasPorPeriodo(req.userCnpjEmpresa, query);
  }

  @Permissao(PERMISSOES.FINANCEIRO_VER)
  @Get('ultimos-pagamentos')
  ultimosPagamentos(
    @Query() query: UltimosPagamentosQueryDto,
    @Req() req: any,
  ) {
    return this.service.ultimosPagamentos(req.userCnpjEmpresa, query);
  }

  @Permissao(PERMISSOES.FINANCEIRO_VER)
  @Get('despesas')
  listarDespesas(@Query() query: PeriodoQueryDto, @Req() req: any) {
    return this.service.listarDespesas(req.userCnpjEmpresa, query);
  }

  @Permissao(PERMISSOES.FINANCEIRO_VER)
  @Post('despesas')
  criarDespesa(@Body() dto: CriarDespesaDto, @Req() req: any) {
    return this.service.criarDespesa(
      dto,
      req.userCnpjEmpresa,
      Number(req.user?.sub),
    );
  }

  @Permissao(PERMISSOES.FINANCEIRO_VER)
  @Delete('despesas/:id')
  removerDespesa(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.service.removerDespesa(id, req.userCnpjEmpresa);
  }
}
