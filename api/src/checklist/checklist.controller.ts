import { Controller, Post, Put, Body, Param, Req } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { ChecklistDto } from './dto/checklist.dto';

@Controller('checklist')
export class ChecklistController {
    constructor(private readonly service: ChecklistService) {}

    @Post()
    registrar(@Body() dto: ChecklistDto, @Req() req) {
        return this.service.registrar(dto, req.userCnpjEmpresa );
    }

    @Put(':id')
    atualizar(@Param('id') id: string, @Body() dto: ChecklistDto, @Req() req) {
        return this.service.atualizar(+id, dto, req.userCnpjEmpresa );
    }
}