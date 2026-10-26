import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdemServicoDto } from '@/type/service-order.dto';
import { OrdemServicoRepository } from './service-order.repository';

import * as puppeteer from 'puppeteer';
import { gerarHtmlOrdemServico } from './service-order.template';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdemServicoService {
  constructor(
    private readonly repository: OrdemServicoRepository,
    private readonly prisma: PrismaService,
  ) {}

  async abrir(dto: OrdemServicoDto, cnpjEmpresa: string) {
    const aparelho = await this.prisma.aparelho.findFirst({
      where: { imei: dto.imeiAparelho },
    });
    if (!aparelho)
      throw new NotFoundException('Aparelho não encontrado para esta empresa');

    const usuario = await this.prisma.usuario.findFirst({
      where: { idUsuario: dto.idUsuario, cnpjEmpresa },
    });
    if (!usuario)
      throw new NotFoundException('Usuário não encontrado para esta empresa');

    const cliente = await this.prisma.cliente.findFirst({
      where: { cpf: dto.cpfCliente, cnpjEmpresa },
    });
    if (!cliente)
      throw new NotFoundException('Cliente não encontrado para esta empresa');

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
      vlTotal: new Prisma.Decimal(dto.vlTotal),
      status: 'ABERTA',
    });
  }

  async atualizarStatus(numOs: number, status: string, cnpjEmpresa: string) {
    if (!cnpjEmpresa) {
      throw new BadRequestException('Empresa não identificada');
    }

    return this.repository.executarTransacao(async (tx) => {
      await this.repository.bloquearOs(tx, numOs, cnpjEmpresa);

      const os = await tx.ordemServico.findFirst({
        where: { numOs, cnpjEmpresa },
        select: {
          numOs: true,
          vlTotal: true,
          status: true,
          pagamentos: {
            select: { valorPago: true },
          },
        },
      });

      if (!os) {
        throw new NotFoundException('Ordem de serviço não encontrada');
      }

      if (status === 'FINALIZADO') {
        if (os.status === 'FINALIZADO') {
          throw new BadRequestException('Ordem de serviço já finalizada');
        }

        if (os.vlTotal === null || os.vlTotal.lessThanOrEqualTo(0)) {
          throw new BadRequestException(
            'A OS não possui um valor válido para finalização',
          );
        }

        const totalPago = os.pagamentos.reduce(
          (total, pagamento) =>
            total.plus(pagamento.valorPago ?? new Prisma.Decimal(0)),
          new Prisma.Decimal(0),
        );

        if (totalPago.lessThan(os.vlTotal)) {
          const saldoRestante = os.vlTotal.minus(totalPago);

          throw new BadRequestException(
            `Não é possível finalizar a OS. Saldo pendente: R$ ${saldoRestante.toFixed(2)}`,
          );
        }
      }

      return this.repository.atualizarStatus(tx, numOs, status, cnpjEmpresa);
    });
  }

  async listar(cnpjEmpresa: string) {
    return await this.repository.listar(cnpjEmpresa);
  }

  async buscarPorNumOs(numOs: number, cnpjEmpresa: string) {
    return await this.repository.buscarPorNumOs(numOs, cnpjEmpresa);
  }

  // add esse método para busca da ultima O.S pelo IMEI em casa de retrabalho
  async buscarUltimaOsPorImei(imei: string, cnpjEmpresa: string) {
    const ultimaOs = await this.prisma.ordemServico.findFirst({
      where: {
        imeiAparelho: imei,
        cnpjEmpresa: cnpjEmpresa,
      },
      orderBy: {
        numOs: 'desc',
      },
    });

    return ultimaOs;
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
