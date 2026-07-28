import { Body, Controller, Param, Post, Put, Req, Get } from '@nestjs/common';
import { AparelhoService } from './aparelho.service';
import { AparelhoDto } from './dto/aparelho.dto';

@Controller('aparelho')
export class AparelhoController {
    constructor(private readonly service: AparelhoService) {}

    @Post()
    cadatrar(@Body() dto: AparelhoDto, @Req() req: any) {
        return this.service.cadastro(dto, req.userCnpjEmpresa as string);
    }
    @Get()
    listar(@Req() req: any){
        return this.service.listar(req.userCnpjEmpresa as string)
    }

    @Put(':id')
    atualizar(@Param('id') id: string, @Body() dto: AparelhoDto, @Req() req: any) {
        return this.service.atualizar(id, dto, req.userCnpjEmpresa as string);
    }
}
