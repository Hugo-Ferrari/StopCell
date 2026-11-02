import { Controller, Post, Body, Req } from '@nestjs/common';
import { DiagnosticoService } from './diagnosis.service';
import { DiagnosticoDto } from '@/type/diagnosis.dto';
import { Permissao } from '@/common/decorators/permissao.decorator'; // <- novo
import { PERMISSOES } from '@/common/permissoes/catalogo'; // <- novo

@Controller('diagnostico')
export class DiagnosticoController {
  constructor(private readonly service: DiagnosticoService) {}

  @Permissao(PERMISSOES.ORDENS_EDITAR) // <- novo
  @Post()
  cadastrar(@Body() dto: DiagnosticoDto, @Req() req: any) {
    return this.service.cadastrar(dto, req.userCnpjEmpresa);
  }
}