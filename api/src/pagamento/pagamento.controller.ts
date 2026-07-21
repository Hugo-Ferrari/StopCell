import { Controller, Post, Body, Req } from '@nestjs/common';
import { PagamentoService } from './pagamento.service';
import { PagamentoDto } from './dto/pagamento.dto';

@Controller('pagamento')
export class PagamentoController {
    constructor(private readonly service: PagamentoService) {}

    @Post()
    registrar(@Body() dto: PagamentoDto, @Req() req: any) {
        return this.service.registrar(dto, req.userCnpjEmpresa as string);
    }
}