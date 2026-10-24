import { PrismaService } from 'src/prisma/prisma.service';
import { PagamentoDto } from '@/type/payment.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PagamentoRepository {
  constructor(private readonly prisma: PrismaService) {}

  registrar(dto: PagamentoDto) {
    return this.prisma.pagamento.create({
      data: {
        numOs: dto.numOs,
        valorPago: dto.valorPago,
        formaPagamento: dto.formaPagamento,
        dtPagamento: new Date(),
      },
    });
  }

  buscarOsParaPagamento(numOs: number, cnpjEmpresa: string) {
    return this.prisma.ordemServico.findFirst({
      where: { numOs, cnpjEmpresa },
      select: {
        numOs: true,
        vlTotal: true,
        pagamentos: {
          select: {
            valorPago: true,
          },
        },
      },
    });
  }

  listarPagamentos(cnpjEmpresa: string) {
    return this.prisma.pagamento.findMany({
      where: {
        ordemServico: {
          cnpjEmpresa,
        },
      },
    });
  }

  buscarPorId(idPagamento: number, cnpjEmpresa: string) {
    return this.prisma.pagamento.findFirst({
      where: { idPagamento, ordemServico: { cnpjEmpresa } },
    });
  }

  listarPorOs(numOs: number, cnpjEmpresa: string) {
    return this.prisma.pagamento.findMany({
      where: {
        numOs,
        ordemServico: {
          cnpjEmpresa,
        },
      },
      orderBy: {
        dtPagamento: 'desc',
      },
    });
  }
}
