import {
  Controller,
  Patch,
  Param,
  Query,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { OsChecklistService } from './os-checklist.service';

@Controller('os-checklist')
export class OsChecklistController {
  constructor(private readonly service: OsChecklistService) {}

  @Patch(':ordemServicoId/:checklistId/status')
  async atualizarStatus(@Param('ordemServicoId') ordemServicoId: string, @Param('checklistId') checklistId: string, @Query('status') status: string, @Req() req: any, ) {
    const resposta = await this.service.atualizarStatus(
      +ordemServicoId,
      +checklistId,
      status,
      req.userCnpjEmpresa as string,
    );

    if (!resposta) {
      throw new NotFoundException();
    }

    return resposta;
  }
}
