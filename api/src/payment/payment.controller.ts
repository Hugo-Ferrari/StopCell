import { Controller, Post, Body, Req, Get, Query, Param } from '@nestjs/common';
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
  buscaPagamento(@Query() @Req() req:any){
    return this.service
  }
  @Get(':idPagamento')
  buscarDetalhesDoPagamento(@Param('idPagamento') idPagamento:string, @Req() req:any){
    return this.service.
  }

  @Get('os/:numOs')
 listarPagamentoOs(@Param('numOs') numOs:string, @Req() req:any){
  return this.service
 }

 @Get('os/:numOs/resumo')
 consultaTotalPagoESaldo(@Param('numOs') numOs:string, @Req() req: any){

 }
 


}
