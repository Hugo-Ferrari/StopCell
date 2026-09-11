import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PagamentoPixService } from './pix-payment.service';
import { PagamentoPixDto } from '@/type/pix-payment.dto';

@Controller('pagamento/pix')
export class PagamentoPixController {
  constructor(private readonly service: PagamentoPixService) {}

  @Post()
  registrar(@Body() dto: PagamentoPixDto,  ) {
    return this.service.registrar(dto);
  }

  @Get('qrcode')
  gerarQrCode(@Body() dto: PagamentoPixDto) {
    return this.service.gerarQrCode(dto);
  }

  @Get('verificar/:txid')
  verificarTransacao(@Param('txid') txid: string, ) {
    return this.service.verificarTransacao(txid);
  }
}
