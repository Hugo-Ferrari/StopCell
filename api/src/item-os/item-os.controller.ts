import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ItemOsService } from './item-os.service';
import { ItemOsDto } from '@/type/itemOs.dto';
import { Permissao } from '@/common/decorators/permissao.decorator';
import { PERMISSOES } from '@/common/permissoes/catalogo';

@Controller('item-os')
export class ItemOsController {
  constructor(private readonly service: ItemOsService) {}

  @Permissao(PERMISSOES.ORDENS_EDITAR)
  @Post()
  registrar(@Body() dto: ItemOsDto, @Req() req: any) {
    return this.service.registrar(dto, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ORDENS_EDITAR)
  @Delete(':idItemOs')
  @HttpCode(204)
  remover(@Param('idItemOs', ParseIntPipe) idItemOs: number, @Req() req: any) {
    return this.service.remover(idItemOs, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ORDENS_VER, PERMISSOES.HISTORICO_VER)
  @Get(':numOs')
  findByNumOs(@Param('numOs', ParseIntPipe) numOs: number, @Req() req: any) {
    return this.service.findByNumOs(numOs, req.userCnpjEmpresa);
  }
}