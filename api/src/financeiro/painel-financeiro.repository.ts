import { Injectable } from '@nestjs/common';
import { StatusOs } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export const STATUS_EM_ANDAMENTO: StatusOs[] = [
  'ABERTA',
  'DIAGNOSTICO',
  'EM_APROVACAO',
  'EM_REPARO',
  'AGUARDANDO_PECA',
];

@Injectable()
export class PainelFinanceiroRepository {
  constructor(private readonly prisma: PrismaService) {}

  // mesma regra do resumo: conta no dia em que a O.S. saiu,
  // e O.S. antiga sem data de saída usa a data do pagamento
  listarOsFinalizadas(cnpjEmpresa: string, inicio: Date, fim: Date) {
    return this.prisma.ordemServico.findMany({
      where: {
        cnpjEmpresa,
        status: 'FINALIZADO',
        OR: [
          { dtSaida: { gte: inicio, lte: fim } },
          {
            dtSaida: null,
            pagamentos: { some: { dtPagamento: { gte: inicio, lte: fim } } },
          },
        ],
      },
      select: {
        numOs: true,
        cpfCliente: true,
        dtEntrada: true,
        dtSaida: true,
        aparelho: { select: { marca: { select: { nmMarca: true } } } },
        itensOs: {
          select: {
            tipo: true,
            descricao: true,
            quantidade: true,
            valorUnitario: true,
          },
        },
        pagamentos: { select: { valorPago: true } },
      },
    });
  }

  // só a data de entrada, pra montar o mapa de dia da semana e turno
  listarEntradas(cnpjEmpresa: string, inicio: Date, fim: Date) {
    return this.prisma.ordemServico.findMany({
      where: { cnpjEmpresa, dtEntrada: { gte: inicio, lte: fim } },
      select: { dtEntrada: true },
    });
  }

  // O.S. abertas agora, independente do período: é o dinheiro que ainda vai entrar
  listarEmAndamento(cnpjEmpresa: string) {
    return this.prisma.ordemServico.findMany({
      where: { cnpjEmpresa, status: { in: STATUS_EM_ANDAMENTO } },
      select: {
        status: true,
        itensOs: { select: { quantidade: true, valorUnitario: true } },
      },
    });
  }

  contarOsPorCliente(cnpjEmpresa: string, cpfs: string[]) {
    return this.prisma.ordemServico.groupBy({
      by: ['cpfCliente'],
      where: {
        cnpjEmpresa,
        cpfCliente: { in: cpfs },
        status: { not: 'CANCELADO' },
      },
      _count: { _all: true },
    });
  }
}