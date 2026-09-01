import { Controller, Post, Body, Req } from '@nestjs/common';
import { DiagnosticoService } from './diagnosis.service';
import { DiagnosticoDto } from './dto/diagnosis.dto';

@Controller('diagnostico')
export class DiagnosticoController {
    constructor(private readonly service: DiagnosticoService) {}

    @Post()
    cadastrar(@Body() dto: DiagnosticoDto, @Req() req: any) {
        return this.service.cadastrar(dto, req.userCnpjEmpresa );
    }
}