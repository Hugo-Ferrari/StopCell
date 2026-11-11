import api from "@/api/api";
import type { FormaPagamento } from "@/services/pagamentoService";

export type AgruparPeriodo = "dia" | "mes";

export interface PeriodoParams {
  inicio: string;
  fim: string;
  agrupar?: AgruparPeriodo;
}

export interface ResumoFinanceiro {
  inicio: string;
  fim: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  quantidadeOsFinalizadas: number;
  quantidadeDespesas: number;
}

export interface SeriePeriodo {
  inicio: string;
  fim: string;
  agrupar: AgruparPeriodo;
  itens: { periodo: string; total: number }[];
}

export interface ReceitasPorForma {
  inicio: string;
  fim: string;
  itens: { formaPagamento: FormaPagamento; total: number }[];
}

export interface UltimoPagamento {
  idPagamento: number;
  numOs: number;
  valorPago: number;
  formaPagamento: FormaPagamento | null;
  dtPagamento: string | null;
  nomeCliente: string;
}

export interface Despesa {
  idDespesa: number;
  descricao: string;
  valor: number;
  dataDespesa: string;
  idUsuario: number | null;
}

// só as rotas de série aceitam "agrupar"; nas outras a API recusa o parâmetro extra
function queryPeriodo({ inicio, fim }: PeriodoParams) {
  return { inicio, fim };
}

function queryDeSerie({ inicio, fim, agrupar }: PeriodoParams) {
  return { inicio, fim, ...(agrupar ? { agrupar } : {}) };
}

export async function buscarResumo(params: PeriodoParams): Promise<ResumoFinanceiro> {
  const { data } = await api.get("/financeiro/resumo", { params: queryPeriodo(params) });
  return data;
}

export async function buscarReceitasPorPeriodo(params: PeriodoParams): Promise<SeriePeriodo> {
  const { data } = await api.get("/financeiro/receitas-por-periodo", {
    params: queryDeSerie(params),
  });
  return data;
}

export async function buscarReceitasPorForma(params: PeriodoParams): Promise<ReceitasPorForma> {
  const { data } = await api.get("/financeiro/receitas-por-forma-pagamento", {
    params: queryPeriodo(params),
  });
  return data;
}

export async function buscarDespesasPorPeriodo(params: PeriodoParams): Promise<SeriePeriodo> {
  const { data } = await api.get("/financeiro/despesas-por-periodo", {
    params: queryDeSerie(params),
  });
  return data;
}

export async function buscarUltimosPagamentos(limite = 10): Promise<{ itens: UltimoPagamento[] }> {
  const { data } = await api.get("/financeiro/ultimos-pagamentos", { params: { limite } });
  return data;
}

export async function listarDespesas(params: PeriodoParams): Promise<Despesa[]> {
  const { data } = await api.get("/financeiro/despesas", { params: queryPeriodo(params) });
  return data;
}

export async function criarDespesa(payload: {
  descricao: string;
  valor: number;
  dataDespesa?: string;
}): Promise<Despesa> {
  const { data } = await api.post("/financeiro/despesas", payload);
  return data;
}

export async function removerDespesa(idDespesa: number): Promise<void> {
  await api.delete(`/financeiro/despesas/${idDespesa}`);
}
