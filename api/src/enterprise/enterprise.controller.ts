import { EmpresaService } from './enterprise.service';
import { Body, Controller, Get,  Patch, Post, Req } from '@nestjs/common';
import { EmpresaDto, UpdateEmpresaDTO } from '@/type/enterprise.dto';

@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get('minha')
  buscarMinha(@Req() req) {
    return this.empresaService.buscarPorCnpj(req.userCnpjEmpresa);
  }

  @Post()
  cadastar(@Body() empresa: EmpresaDto) {
    return this.empresaService.cadastrar(empresa);
  }
   @Patch('minha')
  atualizar(@Body() dto: UpdateEmpresaDTO, @Req() req) {
    return this.empresaService.atualizar(req.userCnpjEmpresa, dto);
  }
}
