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

@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly service: PagamentoService) {}

  @Post()
  registrar(@Body() dto: PagamentoDto, @Req() req: any) {
    return this.service.registrar(dto, req.userCnpjEmpresa);
  }

  @Get()
  buscaPagamento(@Req() req: any) {
    return this.service.listarPagamento(req.userCnpjEmpresa);
  }

  @Get(':idPagamento')
  buscarDetalhesDoPagamento(
    @Param('idPagamento', ParseIntPipe) idPagamento: number,
    @Req() req: any,
  ) {
    return this.service.buscarPorId(idPagamento, req.userCnpjEmpresa);
  }

  @Get('os/:numOs')
  listarPagamentoOs(
    @Param('numOs', ParseIntPipe) numOs: number,
    @Req() req: any,
  ) {
    return this.service.listarPorOs(numOs, req.userCnpjEmpresa);
  }
}
