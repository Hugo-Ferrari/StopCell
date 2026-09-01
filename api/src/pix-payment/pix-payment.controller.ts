import { Controller, Post, Get, Body, Param, Req } from '@nestjs/common';
import { PagamentoPixService } from './pix-payment.service';
import { PagamentoPixDto } from './dto/pix-payment.dto';

@Controller('pagamento/pix')
export class PagamentoPixController {
    constructor(private readonly service: PagamentoPixService) {}

    @Post()
    registrar(@Body() dto: PagamentoPixDto, @Req() req: any) {
        return this.service.registrar(dto, req.userCnpjEmpresa );
    }

    @Get('qrcode')
    gerarQrCode(@Body() dto: PagamentoPixDto) {
        return this.service.gerarQrCode(dto,req.userCnpjEmpresa );
    }

    @Get('verificar/:txid')
    verificarTransacao(@Param('txid') txid: string, @Req() req: any) {
        return this.service.verificarTransacao(txid, req.userCnpjEmpresa );
    }
}