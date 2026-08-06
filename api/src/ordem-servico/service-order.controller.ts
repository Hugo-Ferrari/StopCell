import { Controller, Post, Patch, Get, Body, Param, Query, Res, Req, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { OrdemServicoService } from './service-order.service';
import { OrdemServicoDto } from './dto/service-order.dto';

@Controller('ordemServico')
export class OrdemServicoController {
    constructor(private readonly service: OrdemServicoService) { }

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
    @Get()
    listar(@Req() req: any) {
        return this.service.listar(req.userCnpjEmpresa);
    }

    @Get(':numOs')
    async buscarPorNumOs(@Param('numOs') numOs: string, @Req() req: any) {
        const os = await this.service.buscarPorNumOs(+numOs, req.userCnpjEmpresa as string);

        if (!os) {
            throw new NotFoundException('Ordem de serviço não encontrada');
        }

        return os;
    }

    @Get(':numOs/pdf')
    async gerarPdf(@Param('numOs') numOs: string, @Res() res: Response, @Req() req: any) {
        const pdfBuffer = await this.service.gerarPdf(+numOs, req.userCnpjEmpresa as string);

        res.set({'Content-Type': 'application/pdf','Content-Disposition': `inline; filename=os-${numOs}.pdf`,});

        res.send(pdfBuffer);
    }
}