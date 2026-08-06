import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { MarcaService } from './mark.service';
import { MarcaDto } from './dto/mark.dto';

@Controller('marca')
export class MarcaController {
    constructor(private readonly service: MarcaService) {}

    @Post()
    cadastrar(@Body() dto: MarcaDto, @Req() req: any) {
        return this.service.cadastrar(dto, req.userCnpjEmpresa as string);
    }

    @Put(':id')
    atualizar(@Param('id') id: number, @Body() dto: MarcaDto, @Req() req: any) {
        return this.service.atualizar(id, dto, req.userCnpjEmpresa as string);
    }

    @Get(':nome')
    listarPorNomes(@Param('nome') nome: string, @Req() req: any) {
        return this.service.listarPorNomes(nome, req.userCnpjEmpresa as string);
    }
}
