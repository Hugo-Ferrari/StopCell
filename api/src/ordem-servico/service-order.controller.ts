import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  Query,
  Res,
  Req,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { OrdemServicoService } from './service-order.service';
import { OrdemServicoDto } from '@/type/service-order.dto';
import { Permissao } from '@/common/decorators/permissao.decorator'; // <- novo
import { PERMISSOES } from '@/common/permissoes/catalogo'; // <- novo

@Controller('ordemServico')
export class OrdemServicoController {
  constructor(private readonly service: OrdemServicoService) {}

  @Permissao(PERMISSOES.ORDENS_EDITAR) // <- novo
  @Post()
  abrir(@Body() dto: OrdemServicoDto, @Req() req: any) {
    return this.service.abrir(dto, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ORDENS_EDITAR) // <- novo
  @Patch(':numOs/status')
  async atualizarStatus(
    @Param('numOs') numOs: string,
    @Query('status') status: string,
    @Req() req: any,
  ) {
    const resposta = await this.service.atualizarStatus(
      +numOs,
      status,
      req.userCnpjEmpresa,
    );

    if (!resposta) {
      throw new NotFoundException();
    }

    return resposta;
  }

  @Permissao(PERMISSOES.ORDENS_VER, PERMISSOES.HISTORICO_VER) // <- novo
  @Get()
  listar(@Req() req: any) {
    return this.service.listar(req.userCnpjEmpresa);
  }

  // ROTA NOVA: Busca a última O.S. vinculada ao IMEI para preencher retrabalho
  @Permissao(PERMISSOES.ORDENS_VER, PERMISSOES.HISTORICO_VER) // <- novo
  @Get('aparelho/:imei/ultima')
  async buscarUltimaOsPorImei(@Param('imei') imei: string, @Req() req: any) {
    const ultimaOs = await this.service.buscarUltimaOsPorImei(
      imei,
      req.userCnpjEmpresa,
    );

    if (!ultimaOs) {
      throw new NotFoundException(
        'Nenhuma O.S. anterior encontrada para este aparelho',
      );
    }

    return ultimaOs;
  }

  @Permissao(PERMISSOES.ORDENS_VER, PERMISSOES.HISTORICO_VER) // <- novo
  @Get(':numOs')
  async buscarPorNumOs(@Param('numOs') numOs: string, @Req() req: any) {
    const os = await this.service.buscarPorNumOs(+numOs, req.userCnpjEmpresa);

    if (!os) {
      throw new NotFoundException('Ordem de serviço não encontrada');
    }

    return os;
  }

  @Permissao(PERMISSOES.ORDENS_VER, PERMISSOES.HISTORICO_VER) // <- novo
  @Get(':numOs/pdf')
  async gerarPdf(
    @Param('numOs') numOs: string,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const pdfBuffer = await this.service.gerarPdf(+numOs, req.userCnpjEmpresa);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=os-${numOs}.pdf`,
    });

    res.send(pdfBuffer);
  }
}