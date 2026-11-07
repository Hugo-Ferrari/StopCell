import { EmpresaService } from './enterprise.service';
import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { EmpresaDto, UpdateEmpresaDTO } from '@/type/enterprise.dto';
import { Permissao, SomenteDono } from '@/common/decorators/permissao.decorator'; // <- novo
import { PERMISSOES } from '@/common/permissoes/catalogo'; // <- novo

@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  // sem etiqueta: qualquer funcionário pode ver os dados da própria loja
  @Get('minha')
  buscarMinha(@Req() req) {
    return this.empresaService.buscarPorCnpj(req.userCnpjEmpresa);
  }

  @SomenteDono() // <- novo
  @Post()
  cadastar(@Body() empresa: EmpresaDto) {
    return this.empresaService.cadastrar(empresa);
  }

  @Permissao(PERMISSOES.LOJA_EDITAR) // <- novo
  @Patch('minha')
  atualizar(@Body() dto: UpdateEmpresaDTO, @Req() req) {
    return this.empresaService.atualizar(req.userCnpjEmpresa, dto);
  }
}