import { EmpresaService } from './enterprise.service';
import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { EmpresaDto } from '@/type/enterprise.dto';

@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get(':cnpj')
  buscarPorCnpj(@Param('cnpj') cnpj: string) {
    return this.empresaService.buscarPorCnpj(cnpj);
  }

  @Post()
  cadastar(@Body() empresa: EmpresaDto) {
    return this.empresaService.cadastrar(empresa);
  }
  @Patch(':cnpj')
  atualizar(@Param('cnpj') cnpj: string, @Body() empresa: EmpresaDto, @Req() req) {
    return this.empresaService.atualizar(cnpj, empresa, req.userCnpjEmpresa);
  }
}
