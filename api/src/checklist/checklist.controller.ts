import { Controller, Post, Put, Body, Param, Req } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { ChecklistDto } from '@/type/checklist.dto';
import { Permissao } from '@/common/decorators/permissao.decorator'; // <- novo
import { PERMISSOES } from '@/common/permissoes/catalogo'; // <- novo

@Controller('checklist')
export class ChecklistController {
  constructor(private readonly service: ChecklistService) {}

  @Permissao(PERMISSOES.ORDENS_EDITAR) // <- novo
  @Post()
  registrar(@Body() dto: ChecklistDto, @Req() req) {
    return this.service.registrar(dto, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ORDENS_EDITAR) // <- novo
  @Put(':id')
  atualizar(@Param('id') id: string, @Body() dto: ChecklistDto, @Req() req) {
    return this.service.atualizar(+id, dto, req.userCnpjEmpresa);
  }
}