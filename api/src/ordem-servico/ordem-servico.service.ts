import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdemServicoDto } from './dto/ordemServico.dto';
import { OrdemServicoRepository } from './ordemServico.repository';

import * as puppeteer from 'puppeteer';
import { gerarHtmlOrdemServico } from './ordem-servico.template';

@Injectable()
export class OrdemServicoService {
    constructor(
        private readonly repository: OrdemServicoRepository,
        private readonly prisma: PrismaService,
    ) { }

    
    async abrir(dto: OrdemServicoDto, cnpjEmpresa: string) {
        const aparelho = await this.prisma.aparelho.findFirst({
            where: { imei: dto.imeiAparelho, cnpjEmpresa },
        });
        if (!aparelho) throw new NotFoundException('Aparelho não encontrado para esta empresa');

        const usuario = await this.prisma.usuario.findFirst({
            where: { idUsuario: dto.idUsuario, cnpjEmpresa },
        });
        if (!usuario) throw new NotFoundException('Usuário não encontrado para esta empresa');

        const cliente = await this.prisma.cliente.findFirst({
            where: { cpf: dto.cpfCliente, cnpjEmpresa },
        });
        if (!cliente) throw new NotFoundException('Cliente não encontrado para esta empresa');

        const empresa = await this.prisma.empresa.findUnique({
            where: { cnpj: cnpjEmpresa },
        });
        if (!empresa) throw new NotFoundException('Empresa não encontrada');

        return this.repository.abrir({
            numOsAnterior: dto.numOsAnterior,
            cpfCliente: dto.cpfCliente,
            imeiAparelho: dto.imeiAparelho,
            cnpjEmpresa,
            idUsuario: dto.idUsuario,
            diagnostico: dto.diagnostico,
            dtEntrada: new Date(),
            status: 'ABERTA',
        });
    }

    async atualizarStatus(numOs: number, status: string, cnpjEmpresa: string) {
        const os = await this.repository.findByNumOs(numOs, cnpjEmpresa);

        if (!os) return null;

        return this.repository.atualizarStatus(numOs, status, cnpjEmpresa);
    }
    async listar(cnpjEmpresa: string) {
        return await this.repository.listar(cnpjEmpresa);
    }

    async buscarPorNumOs(numOs: number, cnpjEmpresa: string) {
        return await this.repository.buscarPorNumOs(numOs, cnpjEmpresa);
    }



    async gerarPdf(numOs: number, cnpjEmpresa: string): Promise<Buffer> {
        const os = await this.repository.buscarParaPdf(numOs, cnpjEmpresa);

        if (!os) {
            throw new NotFoundException('Ordem de serviço não encontrada');
        }

        const html = gerarHtmlOrdemServico(os);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'load' });

        const pdfUint8 = await page.pdf({ format: 'A4', printBackground: true });

        await browser.close();

        const pdfBuffer = Buffer.from(pdfUint8);

        return pdfBuffer;
    }
}