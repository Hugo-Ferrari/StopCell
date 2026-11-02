import {
  Controller,
  Patch,
  Param,
  Query,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { OsChecklistService } from './os-checklist.service';
import { Permissao } from '@/common/decorators/permissao.decorator'; // <- novo
import { PERMISSOES } from '@/common/permissoes/catalogo'; // <- novo

@Controller('os-checklist')
export class OsChecklistController {
  constructor(private readonly service: OsChecklistService) {}

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