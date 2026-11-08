import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { OsChecklistService } from './os-checklist.service';
import { SalvarChecklistOsDto } from '@/type/os-checklist.dto';
import { Permissao } from '@/common/decorators/permissao.decorator'; // <- novo
import { PERMISSOES } from '@/common/permissoes/catalogo'; // <- novo

@Controller('os-checklist')
export class OsChecklistController {
  constructor(private readonly service: OsChecklistService) {}

  @Permissao(PERMISSOES.ORDENS_VER, PERMISSOES.HISTORICO_VER)
  @Get(':numOs')
  listarPorOs(@Param('numOs', ParseIntPipe) numOs: number, @Req() req: any) {
    return this.service.listarPorOs(numOs, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ORDENS_EDITAR)
  @Put(':numOs')
  salvar(
    @Param('numOs', ParseIntPipe) numOs: number,
    @Body() dto: SalvarChecklistOsDto,
    @Req() req: any,
  ) {
    return this.service.salvar(numOs, dto, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ORDENS_EDITAR) // <- novo
  @Patch(':ordemServicoId/:checklistId/status')
  async atualizarStatus(
    @Param('ordemServicoId') ordemServicoId: string,
    @Param('checklistId') checklistId: string,
    @Query('status') status: string,
    @Req() req: any,
  ) {
    const resposta = await this.service.atualizarStatus(
      +ordemServicoId,
      +checklistId,
      status,
      req.userCnpjEmpresa,
    );

    if (!resposta) {
      throw new NotFoundException();
    }

    return resposta;
  }
}