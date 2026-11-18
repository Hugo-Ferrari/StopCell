import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { AparelhoService } from './device.service';
import { AparelhoDto } from '@/type/device.dto';
import { Permissao } from '@/common/decorators/permissao.decorator';
import { PERMISSOES } from '@/common/permissoes/catalogo';

@Controller('aparelho')
export class AparelhoController {
  constructor(private readonly service: AparelhoService) {}

  @Permissao(PERMISSOES.ORDENS_EDITAR)
  @Post()
  cadastrar(@Body() dto: AparelhoDto, @Req() req: any) {
    return this.service.cadastro(dto, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ORDENS_VER)
  @Get()
  listar(@Req() req: any) {
    return this.service.listar(req.userCnpjEmpresa);
  }

  // categorias e marcas pros selects do formulário (antes ficavam fixas no front)
  @Get('opcoes')
  listarOpcoes() {
    return this.service.listarOpcoes();
  }

  // aparelhos que o cliente já trouxe, pra escolher na hora de abrir a O.S.
  @Permissao(PERMISSOES.ORDENS_VER)
  @Get('cliente/:cpf')
  listarPorCliente(@Param('cpf') cpf: string, @Req() req: any) {
    return this.service.listarPorCliente(cpf, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ORDENS_EDITAR)
  @Put(':imei')
  atualizar(@Param('imei') imei: string, @Body() dto: AparelhoDto, @Req() req: any) {
    return this.service.atualizar(imei, dto, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ORDENS_EDITAR)
  @Delete(':imei')
  remover(@Param('imei') imei: string, @Req() req: any) {
    return this.service.remover(imei, req.userCnpjEmpresa);
  }
}