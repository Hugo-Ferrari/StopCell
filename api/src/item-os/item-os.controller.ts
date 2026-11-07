import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ItemOsService } from './item-os.service';
import { ItemOsDto } from '@/type/itemOs.dto';
import { Permissao } from '@/common/decorators/permissao.decorator'; // <- novo
import { PERMISSOES } from '@/common/permissoes/catalogo'; // <- novo

@Controller('item-os')
export class ItemOsController {
  constructor(private readonly service: ItemOsService) {}

  @Permissao(PERMISSOES.ORDENS_EDITAR) // <- novo
  @Post()
  registrar(@Body() dto: ItemOsDto, @Req() req: any) {
    return this.service.registrar(dto, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ORDENS_VER, PERMISSOES.HISTORICO_VER) // <- novo
  @Get(':numOs')
  findByNumOs(@Param('numOs') numOs: string, @Req() req: any) {
    return this.service.findByNumOs(+numOs, req.userCnpjEmpresa);
  }
}