import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Res,
  Req,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { OrdemServicoService } from './service-order.service';
import { AtualizarStatusOsDto, OrdemServicoDto } from '@/type/service-order.dto';
import { Permissao } from '@/common/decorators/permissao.decorator';
import { PERMISSOES } from '@/common/permissoes/catalogo';

@Controller('ordemServico')
export class OrdemServicoController {
  constructor(private readonly service: OrdemServicoService) {}

  // o atendente é quem está logado (sub do token), não um id que o front manda
  @Permissao(PERMISSOES.ORDENS_EDITAR)
  @Post()
  abrir(@Body() dto: OrdemServicoDto, @Req() req: any) {
    return this.service.abrir(dto, req.userCnpjEmpresa, Number(req.user?.sub));
  }

  @Permissao(PERMISSOES.ORDENS_EDITAR)
  @Patch(':numOs/status')
  atualizarStatus(
    @Param('numOs', ParseIntPipe) numOs: number,
    @Body() dto: AtualizarStatusOsDto,
    @Req() req: any,
  ) {
    return this.service.atualizarStatus(numOs, dto.status, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ORDENS_VER, PERMISSOES.HISTORICO_VER)
  @Get()
  listar(@Req() req: any) {
    return this.service.listar(req.userCnpjEmpresa);
  }

  // busca a última O.S. do aparelho pra preencher o retrabalho
  @Permissao(PERMISSOES.ORDENS_VER, PERMISSOES.HISTORICO_VER)
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

  @Permissao(PERMISSOES.ORDENS_VER, PERMISSOES.HISTORICO_VER)
  @Get(':numOs')
  async buscarPorNumOs(@Param('numOs', ParseIntPipe) numOs: number, @Req() req: any) {
    const os = await this.service.buscarPorNumOs(numOs, req.userCnpjEmpresa);

    if (!os) {
      throw new NotFoundException('Ordem de serviço não encontrada');
    }

    return os;
  }

  @Permissao(PERMISSOES.ORDENS_VER, PERMISSOES.HISTORICO_VER)
  @Get(':numOs/pdf')
  async gerarPdf(
    @Param('numOs', ParseIntPipe) numOs: number,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const pdfBuffer = await this.service.gerarPdf(numOs, req.userCnpjEmpresa);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=os-${numOs}.pdf`,
    });

    res.send(pdfBuffer);
  }
}