import { Controller, Post, Get, Body, Param, Req } from '@nestjs/common';
import { PagamentoCartaoService } from './card-payment.service';
import { PagamentoCartaoDto } from './dto/pagamentoCartao.dto';

@Controller('pagamento/cartao')
export class PagamentoCartaoController {
    constructor(private readonly service: PagamentoCartaoService) {}

    @Post()
    registrar(@Body() dto: PagamentoCartaoDto, @Req() req: any) {
        return this.service.registrar(dto, req.userCnpjEmpresa as string);
    }

    @Get('parcelas')
    calcularValorParcela(@Body() dto: PagamentoCartaoDto, ) {
        return this.service.calcularValorParcela(dto,);
    }

    @Get('verificar/:idPagamento')
    verificarTransacao(@Param('idPagamento') idPagamento: string, @Req() req: any) {
        return this.service.verificarTransacao(+idPagamento, req.userCnpjEmpresa as string);
    }
}