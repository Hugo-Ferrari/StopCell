import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CriarDespesaDto,
  PeriodoQueryDto,
  SerieQueryDto,
  UltimosPagamentosQueryDto,
} from '@/type/financeiro.dto';
import {
  FORMAS_PAGAMENTO,
  FinanceiroRepository,
} from './financeiro.repository';

function isoHoje(data = new Date()): string {
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isoInicioDoMes(data = new Date()): string {
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}-01`;
}

function parseIso(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split('-').map(Number);
  const data = new Date(y, m - 1, d);
  const valida =
    data.getFullYear() === y &&
    data.getMonth() === m - 1 &&
    data.getDate() === d;

  if (!valida) {
    throw new BadRequestException(`Data inválida: ${iso}`);
  }

  return { y, m, d };
}

function inicioDoDia(iso: string): Date {
  const { y, m, d } = parseIso(iso);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function fimDoDia(iso: string): Date {
  const { y, m, d } = parseIso(iso);
  return new Date(y, m - 1, d, 23, 59, 59, 999);
}

function meioDoDia(iso: string): Date {
  const { y, m, d } = parseIso(iso);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

function dinheiro(valor: Prisma.Decimal | number | null | undefined): number {
  if (valor == null) return 0;
  return Number(new Prisma.Decimal(valor).toFixed(2));
}

function chavePeriodo(data: Date, agrupar: 'dia' | 'mes'): string {
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  if (agrupar === 'mes') return `${y}-${m}`;
  const d = String(data.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

@Injectable()
export class FinanceiroService {
  constructor(private readonly repository: FinanceiroRepository) {}

  private exigirEmpresa(cnpjEmpresa: string) {
    if (!cnpjEmpresa) {
      throw new BadRequestException('Empresa não identificada');
    }
  }

  private resolverPeriodo(query: PeriodoQueryDto) {
    const inicio = query.inicio ?? isoInicioDoMes();
    const fim = query.fim ?? isoHoje();

    if (inicio > fim) {
      throw new BadRequestException('inicio não pode ser depois de fim');
    }

    return {
      inicio,
      fim,
      inicioDate: inicioDoDia(inicio),
      fimDate: fimDoDia(fim),
    };
  }

  async resumo(cnpjEmpresa: string, query: PeriodoQueryDto) {
    this.exigirEmpresa(cnpjEmpresa);
    const { inicio, fim, inicioDate, fimDate } = this.resolverPeriodo(query);

    const [pagamentos, despesas] = await Promise.all([
      this.repository.listarPagamentosNoPeriodo(
        cnpjEmpresa,
        inicioDate,
        fimDate,
      ),
      this.repository.listarDespesasNoPeriodo(cnpjEmpresa, inicioDate, fimDate),
    ]);

    const totalReceitas = pagamentos.reduce(
      (soma, p) => soma + dinheiro(p.valorPago),
      0,
    );
    const totalDespesas = despesas.reduce(
      (soma, d) => soma + dinheiro(d.valor),
      0,
    );
    const osDistintas = new Set(pagamentos.map((p) => p.numOs));

    return {
      inicio,
      fim,
      totalReceitas: Number(totalReceitas.toFixed(2)),
      totalDespesas: Number(totalDespesas.toFixed(2)),
      saldo: Number((totalReceitas - totalDespesas).toFixed(2)),
      quantidadeOsFinalizadas: osDistintas.size,
      quantidadeDespesas: despesas.length,
    };
  }

  async receitasPorPeriodo(cnpjEmpresa: string, query: SerieQueryDto) {
    this.exigirEmpresa(cnpjEmpresa);
    const agrupar = query.agrupar ?? 'dia';
    const { inicio, fim, inicioDate, fimDate } = this.resolverPeriodo(query);

    const pagamentos = await this.repository.listarPagamentosNoPeriodo(
      cnpjEmpresa,
      inicioDate,
      fimDate,
    );

    return {
      inicio,
      fim,
      agrupar,
      itens: this.agruparPorPeriodo(
        pagamentos.map((p) => ({
          data: p.ordemServico.dtSaida ?? p.dtPagamento,
          valor: p.valorPago,
        })),
        agrupar,
      ),
    };
  }

  async receitasPorFormaPagamento(
    cnpjEmpresa: string,
    query: PeriodoQueryDto,
  ) {
    this.exigirEmpresa(cnpjEmpresa);
    const { inicio, fim, inicioDate, fimDate } = this.resolverPeriodo(query);

    const agrupado = await this.repository.somarPorFormaPagamento(
      cnpjEmpresa,
      inicioDate,
      fimDate,
    );

    const mapa = new Map(
      agrupado.map((item) => [
        item.formaPagamento,
        dinheiro(item._sum.valorPago),
      ]),
    );

    return {
      inicio,
      fim,
      itens: FORMAS_PAGAMENTO.map((formaPagamento) => ({
        formaPagamento,
        total: mapa.get(formaPagamento) ?? 0,
      })),
    };
  }

  async despesasPorPeriodo(cnpjEmpresa: string, query: SerieQueryDto) {
    this.exigirEmpresa(cnpjEmpresa);
    const agrupar = query.agrupar ?? 'dia';
    const { inicio, fim, inicioDate, fimDate } = this.resolverPeriodo(query);

    const despesas = await this.repository.listarDespesasNoPeriodo(
      cnpjEmpresa,
      inicioDate,
      fimDate,
    );

    return {
      inicio,
      fim,
      agrupar,
      itens: this.agruparPorPeriodo(
        despesas.map((d) => ({
          data: d.dataDespesa,
          valor: d.valor,
        })),
        agrupar,
      ),
    };
  }

  async ultimosPagamentos(
    cnpjEmpresa: string,
    query: UltimosPagamentosQueryDto,
  ) {
    this.exigirEmpresa(cnpjEmpresa);
    const limite = query.limite ?? 10;

    const pagamentos = await this.repository.listarUltimosPagamentos(
      cnpjEmpresa,
      limite,
    );

    return {
      itens: pagamentos.map((p) => ({
        idPagamento: p.idPagamento,
        numOs: p.numOs,
        valorPago: dinheiro(p.valorPago),
        formaPagamento: p.formaPagamento,
        dtPagamento: p.dtPagamento,
        nomeCliente: p.ordemServico.cliente.nmCompleto ?? '',
      })),
    };
  }

  async listarDespesas(cnpjEmpresa: string, query: PeriodoQueryDto) {
    this.exigirEmpresa(cnpjEmpresa);
    const { inicioDate, fimDate } = this.resolverPeriodo(query);

    const despesas = await this.repository.listarDespesasNoPeriodo(
      cnpjEmpresa,
      inicioDate,
      fimDate,
    );

    return despesas.map((d) => ({
      idDespesa: d.idDespesa,
      descricao: d.descricao,
      valor: dinheiro(d.valor),
      dataDespesa: d.dataDespesa,
      idUsuario: d.idUsuario,
    }));
  }

  async criarDespesa(
    dto: CriarDespesaDto,
    cnpjEmpresa: string,
    idUsuario: number,
  ) {
    this.exigirEmpresa(cnpjEmpresa);

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
      throw new BadRequestException('Usuário não identificado');
    }

    const dataDespesa = dto.dataDespesa
      ? meioDoDia(dto.dataDespesa)
      : new Date();

    const criada = await this.repository.criarDespesa({
      cnpjEmpresa,
      descricao: dto.descricao.trim(),
      valor: dto.valor,
      dataDespesa,
      idUsuario,
    });

    return {
      idDespesa: criada.idDespesa,
      descricao: criada.descricao,
      valor: dinheiro(criada.valor),
      dataDespesa: criada.dataDespesa,
      idUsuario: criada.idUsuario,
    };
  }

  async removerDespesa(idDespesa: number, cnpjEmpresa: string) {
    this.exigirEmpresa(cnpjEmpresa);

    const despesa = await this.repository.buscarDespesa(idDespesa, cnpjEmpresa);
    if (!despesa) {
      throw new NotFoundException('Despesa não encontrada');
    }

    await this.repository.removerDespesa(idDespesa);
    return { idDespesa };
  }

  private agruparPorPeriodo(
    lancamentos: {
      data: Date | null;
      valor: Prisma.Decimal | number | null;
    }[],
    agrupar: 'dia' | 'mes',
  ) {
    const totais = new Map<string, number>();

    for (const lancamento of lancamentos) {
      if (!lancamento.data) continue;
      const chave = chavePeriodo(lancamento.data, agrupar);
      totais.set(chave, (totais.get(chave) ?? 0) + dinheiro(lancamento.valor));
    }

    return [...totais.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([periodo, total]) => ({
        periodo,
        total: Number(total.toFixed(2)),
      }));
  }
}
