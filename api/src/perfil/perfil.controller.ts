import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { PerfilService } from './perfil.service';
import { AtualizarPerfilDto, PerfilDto } from '@/type/perfil.dto';
import { SomenteDono } from '@/common/decorators/permissao.decorator';

@Controller('perfis')
export class PerfilController {
  constructor(private readonly service: PerfilService) {}

  // lista de permissões que existem no sistema (o front monta os checkboxes com ela)
  @Get('permissoes')
  catalogo() {
    return this.service.catalogo();
  }

  @SomenteDono()
  @Get()
  listar(@Req() req: any) {
    return this.service.listar(req.userCnpjEmpresa);
  }

  @SomenteDono()
  @Post()
  criar(@Body() dto: PerfilDto, @Req() req: any) {
    return this.service.criar(dto, req.userCnpjEmpresa);
  }

  @SomenteDono()
  @Patch(':id')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarPerfilDto, @Req() req: any) {
    return this.service.atualizar(id, dto, req.userCnpjEmpresa);
  }

  @SomenteDono()
  @Delete(':id')
  remover(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.service.remover(id, req.userCnpjEmpresa);
  }
}