import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { MarcaService } from './mark.service';
import { MarcaDto } from './dto/mark.dto';

@Controller('marca')
export class MarcaController {
    constructor(private readonly service: MarcaService) {}

    @Post()
    cadastrar(@Body() dto: MarcaDto) {
        return this.service.cadastrar(dto);
    }

    @Put(':id')
    atualizar(@Param('id') id: string, @Body() dto: MarcaDto) {
        return this.service.atualizar(+id, dto,req.userCnpjEmpresa as string);
    }

    @Get(':nome')
    listarPorNomes(@Param('nome') nome: string) {
        return this.service.listarPorNomes(nome,req.userCnpjEmpresa as string);
    }
}