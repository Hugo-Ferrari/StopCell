import { Controller, Post, Patch, Get, Body, Param, Query, Res, Req, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { OrdemServicoService } from './ordem-servico.service';
import { OrdemServicoDto } from './dto/ordemServico.dto';

@Controller('ordemServico')
export class OrdemServicoController {
    constructor(private readonly service: OrdemServicoService) {}

    @Post()
    abrir(@Body() dto: OrdemServicoDto, @Req() req: any) {
        return this.service.abrir(dto, req.userCnpjEmpresa as string);
    }

    @Patch(':numOs/status')
    async atualizarStatus(@Param('numOs') numOs: string, @Query('status') status: string, @Req() req: any) {
        const resposta = await this.service.atualizarStatus(+numOs, status, req.userCnpjEmpresa as string);

        if (!resposta) {
            throw new NotFoundException();
        }

        return resposta;
    }

    @Get(':numOs/pdf')
    async gerarPdf(@Param('numOs') numOs: string, @Res() res: Response, @Req() req: any) {
        const pdfBuffer = await this.service.gerarPdf(+numOs, req.userCnpjEmpresa as string);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename=os-${numOs}.pdf`,
        });

        res.send(pdfBuffer);
    }
}