import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, StatusOs, TipoItemOs } from '@prisma/client';
import { PeriodoQueryDto } from '@/type/financeiro.dto';
import { FinanceiroRepository } from './financeiro.repository';
import {
  PainelFinanceiroRepository,
  STATUS_EM_ANDAMENTO,
} from './painel-financeiro.repository';

type OsFinalizada = Awaited<
  ReturnType<PainelFinanceiroRepository['listarOsFinalizadas']>
>[number];
type OsEmAndamento = Awaited<
  ReturnType<PainelFinanceiroRepository['listarEmAndamento']>
>[number];
type Turno = 'manha' | 'tarde' | 'noite';
type Valor = Prisma.Decimal | number | null | undefined;

const UM_DIA = 24 * 60 * 60 * 1000;

// o servidor pode rodar em UTC; dia da semana e hora têm que ser os da loja
const RELOGIO_DA_LOJA = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Sao_Paulo',
  weekday: 'short',
  hour: 'numeric',
  hourCycle: 'h23',
});
const DIA_DA_SEMANA: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function dinheiro(valor: Valor) {
  return valor == null ? 0 : Number(valor);
}

function arredondar(valor: number) {
  return Math.round(valor * 100) / 100;
}

function partesIso(iso: string) {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return { ano, mes: mes - 1, dia };
}

function chaveMes(data: Date) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
}

function valorDoItem(item: { quantidade: number | null; valorUnitario: Valor }) {
  return (item.quantidade ?? 1) * dinheiro(item.valorUnitario);
}

function turnoDa(hora: number): Turno {
  if (hora < 12) return 'manha';
  if (hora < 18) return 'tarde';
  return 'noite';
}

function tempoMedioDeReparo(ordens: OsFinalizada[]) {
  const dias = ordens
    .filter((os) => os.dtEntrada && os.dtSaida)
    .map((os) => (os.dtSaida!.getTime() - os.dtEntrada!.getTime()) / UM_DIA)
    .filter((d) => d >= 0);

  if (dias.length === 0) return null;
  return Math.round((dias.reduce((s, d) => s + d, 0) / dias.length) * 10) / 10;
}

// serviços e peças com o mesmo nome viram uma linha só ("Troca de tela" em 20 O.S.)
function servicosQueMaisFaturam(ordens: OsFinalizada[]) {
  const grupos = new Map<
    string,
    { descricao: string; tipo: TipoItemOs; total: number; ordens: Set<number> }
  >();
  let totalGeral = 0;

  for (const os of ordens) {
    for (const item of os.itensOs) {
      const valor = valorDoItem(item);
      if (valor <= 0) continue;

      totalGeral += valor;
      const chave = item.descricao.trim().toLowerCase();
      const grupo = grupos.get(chave) ?? {
        descricao: item.descricao.trim(),
        tipo: item.tipo,
        total: 0,
        ordens: new Set<number>(),
      };
      grupo.total += valor;
      grupo.ordens.add(os.numOs);
      grupos.set(chave, grupo);
    }
  }

  const itens = [...grupos.values()]
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)
    .map((g) => ({
      descricao: g.descricao,
      tipo: g.tipo,
      total: arredondar(g.total),
      quantidadeOs: g.ordens.size,
    }));

  return { totalGeral: arredondar(totalGeral), itens };
}

function movimentoPorDiaETurno(entradas: { dtEntrada: Date | null }[]) {
  const contagem = new Map<string, { diaSemana: number; turno: Turno; quantidade: number }>();

  for (const { dtEntrada } of entradas) {
    if (!dtEntrada) continue;
    const partes = RELOGIO_DA_LOJA.formatToParts(dtEntrada);
    const diaSemana = DIA_DA_SEMANA[partes.find((p) => p.type === 'weekday')?.value ?? ''];
    const hora = Number(partes.find((p) => p.type === 'hour')?.value);
    if (diaSemana === undefined || Number.isNaN(hora)) continue;

    const turno = turnoDa(hora);
    const chave = `${diaSemana}-${turno}`;
    const atual = contagem.get(chave) ?? { diaSemana, turno, quantidade: 0 };
    atual.quantidade += 1;
    contagem.set(chave, atual);
  }

  return [...contagem.values()];
}

function dinheiroParado(ordens: OsEmAndamento[]) {
  const porStatus = new Map<StatusOs, { quantidade: number; total: number }>();

  for (const os of ordens) {
    const atual = porStatus.get(os.status) ?? { quantidade: 0, total: 0 };
    atual.quantidade += 1;
    atual.total += os.itensOs.reduce((soma, item) => soma + valorDoItem(item), 0);
    porStatus.set(os.status, atual);
  }

  // sempre na ordem do fluxo da O.S., não na ordem que o banco devolveu
  return STATUS_EM_ANDAMENTO.filter((status) => porStatus.has(status)).map((status) => ({
    status,
    quantidade: porStatus.get(status)!.quantidade,
    total: arredondar(porStatus.get(status)!.total),
  }));
}

function faturamentoPorMarca(ordens: OsFinalizada[]) {
  const marcas = new Map<string, number>();

  for (const os of ordens) {
    const nome = os.aparelho.marca?.nmMarca?.trim() || 'Sem marca';
    const pago = os.pagamentos.reduce((soma, p) => soma + dinheiro(p.valorPago), 0);
    marcas.set(nome, (marcas.get(nome) ?? 0) + pago);
  }

  return [...marcas.entries()]
    .filter(([, total]) => total > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([marca, total]) => ({ marca, total: arredondar(total) }));
}

function faturamentoPorMes(
  inicio: Date,
  fim: Date,
  pagamentos: { valorPago: Valor; dtPagamento: Date | null; ordemServico: { dtSaida: Date | null } }[],
  despesas: { valor: Valor; dataDespesa: Date | null }[],
) {
  const meses = new Map<string, { mes: string; faturamento: number; despesas: number }>();

  for (let d = new Date(inicio); d <= fim; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    meses.set(chaveMes(d), { mes: chaveMes(d), faturamento: 0, despesas: 0 });
  }

  for (const p of pagamentos) {
    const data = p.ordemServico.dtSaida ?? p.dtPagamento;
    const mes = data && meses.get(chaveMes(data));
    if (mes) mes.faturamento += dinheiro(p.valorPago);
  }

  for (const despesa of despesas) {
    const mes = despesa.dataDespesa && meses.get(chaveMes(despesa.dataDespesa));
    if (mes) mes.despesas += dinheiro(despesa.valor);
  }

  return [...meses.values()].map((m) => ({
    mes: m.mes,
    faturamento: arredondar(m.faturamento),
    despesas: arredondar(m.despesas),
  }));
}

@Injectable()
export class PainelFinanceiroService {
  constructor(
    private readonly painel: PainelFinanceiroRepository,
    private readonly financeiro: FinanceiroRepository,
  ) {}

  private periodo(query: PeriodoQueryDto) {
    const hoje = new Date();
    const i = query.inicio ? partesIso(query.inicio) : null;
    const f = query.fim ? partesIso(query.fim) : null;

    const inicio = i
      ? new Date(i.ano, i.mes, i.dia)
      : new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fim = f
      ? new Date(f.ano, f.mes, f.dia, 23, 59, 59, 999)
      : new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59, 999);

    if (inicio > fim) {
      throw new BadRequestException('inicio não pode ser depois de fim');
    }
    return { inicio, fim };
  }

  async painelDoPeriodo(cnpjEmpresa: string, query: PeriodoQueryDto) {
    if (!cnpjEmpresa) {
      throw new BadRequestException('Empresa não identificada');
    }

    const { inicio, fim } = this.periodo(query);

    // período anterior do mesmo tamanho, pra comparar o tempo de reparo
    const fimAnterior = new Date(inicio.getTime() - 1);
    const inicioAnterior = new Date(fimAnterior.getTime() - (fim.getTime() - inicio.getTime()));

    // o gráfico de meses sempre mostra 12 meses terminando no mês do filtro
    const inicioDozeMeses = new Date(fim.getFullYear(), fim.getMonth() - 11, 1);

    const [finalizadas, finalizadasAntes, entradas, emAndamento, pagamentosAno, despesasAno] =
      await Promise.all([
        this.painel.listarOsFinalizadas(cnpjEmpresa, inicio, fim),
        this.painel.listarOsFinalizadas(cnpjEmpresa, inicioAnterior, fimAnterior),
        this.painel.listarEntradas(cnpjEmpresa, inicio, fim),
        this.painel.listarEmAndamento(cnpjEmpresa),
        this.financeiro.listarPagamentosNoPeriodo(cnpjEmpresa, inicioDozeMeses, fim),
        this.financeiro.listarDespesasNoPeriodo(cnpjEmpresa, inicioDozeMeses, fim),
      ]);

    const cpfs = [...new Set(finalizadas.map((os) => os.cpfCliente))];
    const osPorCliente = cpfs.length > 0 ? await this.painel.contarOsPorCliente(cnpjEmpresa, cpfs) : [];

    return {
      tempoReparo: {
        atual: tempoMedioDeReparo(finalizadas),
        anterior: tempoMedioDeReparo(finalizadasAntes),
      },
      clientes: {
        atendidos: cpfs.length,
        recorrentes: osPorCliente.filter((c) => c._count._all > 1).length,
      },
      meses: faturamentoPorMes(inicioDozeMeses, fim, pagamentosAno, despesasAno),
      servicos: servicosQueMaisFaturam(finalizadas),
      movimento: movimentoPorDiaETurno(entradas),
      parado: dinheiroParado(emAndamento),
      marcas: faturamentoPorMarca(finalizadas),
    };
  }
}