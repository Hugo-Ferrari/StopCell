import { Controller, Post, Body, Put, Param, Req } from '@nestjs/common';
import { ServicoService } from './service.service';
import { ServicoDto } from './dto/service.dto';

@Controller('servico')
export class ServicoController {
    constructor(private readonly servicoService: ServicoService) {}

    @Post()
    cadastrar(@Body() servico: ServicoDto, @Req() req: any) {
        return this.servicoService.cadastrar(servico, req.userCnpjEmpresa as string);
    }

    @Put(':id')
    atualizar(@Param('id') id: number, @Body() servico: ServicoDto, @Req() req: any) {
        return this.servicoService.atualizar(id, servico, req.userCnpjEmpresa as string);
    }
}