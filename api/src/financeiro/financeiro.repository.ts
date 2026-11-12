import { Injectable } from '@nestjs/common';
import { FormaPagamento } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

const osFinalizadaDaEmpresa = (cnpjEmpresa: string) => ({
  cnpjEmpresa,
  status: 'FINALIZADO' as const,
});

// a receita entra no gráfico na data em que a OS foi finalizada (dtSaida);
// OS antigas sem dtSaida caem para a data do pagamento
const pagamentoDaOsFinalizada = (
  cnpjEmpresa: string,
  inicio: Date,
  fim: Date,
) => ({
  OR: [
    {
      ordemServico: {
        ...osFinalizadaDaEmpresa(cnpjEmpresa),
        dtSaida: { gte: inicio, lte: fim },
      },
    },
    {
      dtPagamento: { gte: inicio, lte: fim },
      ordemServico: { ...osFinalizadaDaEmpresa(cnpjEmpresa), dtSaida: null },
    },
  ],
});

@Injectable()
export class FinanceiroRepository {
  constructor(private readonly prisma: PrismaService) {}

  listarPagamentosNoPeriodo(
    cnpjEmpresa: string,
    inicio: Date,
    fim: Date,
  ) {
    return this.prisma.pagamento.findMany({
      where: pagamentoDaOsFinalizada(cnpjEmpresa, inicio, fim),
      select: {
        numOs: true,
        valorPago: true,
        dtPagamento: true,
        formaPagamento: true,
        ordemServico: { select: { dtSaida: true } },
      },
    });
  }

  somarPorFormaPagamento(cnpjEmpresa: string, inicio: Date, fim: Date) {
    return this.prisma.pagamento.groupBy({
      by: ['formaPagamento'],
      where: pagamentoDaOsFinalizada(cnpjEmpresa, inicio, fim),
      _sum: { valorPago: true },
    });
  }

  listarDespesasNoPeriodo(cnpjEmpresa: string, inicio: Date, fim: Date) {
    return this.prisma.despesa.findMany({
      where: {
        cnpjEmpresa,
        dataDespesa: { gte: inicio, lte: fim },
      },
      orderBy: { dataDespesa: 'desc' },
    });
  }

  listarUltimosPagamentos(cnpjEmpresa: string, limite: number) {
    return this.prisma.pagamento.findMany({
      where: {
        ordemServico: osFinalizadaDaEmpresa(cnpjEmpresa),
      },
      orderBy: { dtPagamento: 'desc' },
      take: limite,
      select: {
        idPagamento: true,
        numOs: true,
        valorPago: true,
        formaPagamento: true,
        dtPagamento: true,
        ordemServico: {
          select: {
            cliente: { select: { nmCompleto: true } },
          },
        },
      },
    });
  }

  criarDespesa(data: {
    cnpjEmpresa: string;
    descricao: string;
    valor: number;
    dataDespesa: Date;
    idUsuario: number;
  }) {
    return this.prisma.despesa.create({
      data: {
        cnpjEmpresa: data.cnpjEmpresa,
        descricao: data.descricao,
        valor: data.valor,
        dataDespesa: data.dataDespesa,
        idUsuario: data.idUsuario,
      },
    });
  }

  buscarDespesa(idDespesa: number, cnpjEmpresa: string) {
    return this.prisma.despesa.findFirst({
      where: { idDespesa, cnpjEmpresa },
    });
  }

  removerDespesa(idDespesa: number) {
    return this.prisma.despesa.delete({
      where: { idDespesa },
    });
  }
}

export const FORMAS_PAGAMENTO: FormaPagamento[] = [
  'PIX',
  'CARTAO',
  'DINHEIRO',
  'BOLETO',
];
