import { Controller, Post, Get, Body, Param, Req } from '@nestjs/common';
import { PagamentoPixService } from './pagamento-pix.service';
import { PagamentoPixDto } from './dto/pagamentoPix.dto';

@Controller('pagamento/pix')
export class PagamentoPixController {
    constructor(private readonly service: PagamentoPixService) {}

    @Post()
    registrar(@Body() dto: PagamentoPixDto, @Req() req: any) {
        return this.service.registrar(dto, req.userCnpjEmpresa as string);
    }

    @Get('qrcode')
    gerarQrCode(@Body() dto: PagamentoPixDto) {
        return this.service.gerarQrCode(dto);
    }

    @Get('verificar/:txid')
    verificarTransacao(@Param('txid') txid: string, @Req() req: any) {
        return this.service.verificarTransacao(txid, req.userCnpjEmpresa as string);
    }
}