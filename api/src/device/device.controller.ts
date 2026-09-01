import { Body, Controller, Param, Post, Put, Get, Req } from '@nestjs/common';
import { AparelhoService } from './device.service';
import { AparelhoDto } from './dto/device.dto';

@Controller('aparelho')
export class AparelhoController {
    constructor(private readonly service: AparelhoService) {}

    @Post()
    cadastrar(@Body() dto: AparelhoDto, @Req() req) {
        return this.service.cadastro(dto,req.userCnpjEmpresa);
    }

    @Get()
    listar(@Req() req) {
        return this.service.listar(req.userCnpjEmpresa);
    }

    @Put(':id')
    atualizar(@Param('id') id: string, @Body() dto: AparelhoDto, @Req() req  ) {
        return this.service.atualizar(id, dto, req.userCnpjEmpresa);
    }
}