import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { PecaService } from './peca.service';
import { PecaDto } from '@/type/peca.dto';

@Controller('peca')
export class PecaController {
  constructor(private readonly service: PecaService) {}

  @Post()
  cadastrar(@Body() peca: PecaDto, @Req() req: any) {
    return this.service.cadastrar(peca, req.userCnpjEmpresa);
  }

  @Put(':id')
  atualizar(@Param('id') id: number, @Body() peca: PecaDto, @Req() req: any) {
    return this.service.atualizar(id, peca, req.userCnpjEmpresa);
  }

  @Get()
  listar(@Req() req: any) {
    return this.service.listar(req.userCnpjEmpresa);
  }
}
