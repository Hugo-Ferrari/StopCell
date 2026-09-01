import { Body, Controller, Param, Post, Put, Get } from '@nestjs/common';
import { AparelhoService } from './device.service';
import { AparelhoDto } from './dto/device.dto';

@Controller('aparelho')
export class AparelhoController {
    constructor(private readonly service: AparelhoService) {}

    @Post()
    cadastrar(@Body() dto: AparelhoDto) {
        return this.service.cadastro(dto,req.userCnpjEmpresa as string);
    }

    @Get()
    listar() {
        return this.service.listar(req.userCnpjEmpresa as string);
    }

    @Put(':id')
    atualizar(@Param('id') id: string, @Body() dto: AparelhoDto,  ) {
        return this.service.atualizar(id, dto, req.userCnpjEmpresa as string);
    }
}