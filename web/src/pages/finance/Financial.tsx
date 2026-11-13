import { useCallback, useEffect, useMemo, useState } from "react";
import { differenceInCalendarDays, eachDayOfInterval, eachMonthOfInterval, format } from "date-fns";
import { Loader2 } from "lucide-react";
import type { DateRange } from "react-day-picker";

import CardsResumo from "@/components/finance/CardsResumo";
import FiltroPeriodo from "@/components/finance/FiltroPeriodo";
import FormularioDespesa from "@/components/finance/FormularioDespesa";
import GraficoFormaPagamento from "@/components/finance/GraficoFormaPagamento";
import GraficoReceitasDespesas from "@/components/finance/GraficoReceitasDespesas";
import ListaDespesas from "@/components/finance/ListaDespesas";
import TabelaUltimosPagamentos from "@/components/finance/TabelaUltimosPagamentos";
import {
  buscarDespesasPorPeriodo,
  buscarReceitasPorForma,
  buscarReceitasPorPeriodo,
  buscarResumo,
  buscarUltimosPagamentos,
  listarDespesas,
  type AgruparPeriodo,
  type Despesa,
  type ReceitasPorForma,
  type ResumoFinanceiro,
  type SeriePeriodo,
  type UltimoPagamento,
} from "@/services/financeiroService";
import { mensagemDeErro } from "@/utils/apiError";

function iso(data: Date) {
  return format(data, "yyyy-MM-dd");
}

function periodoPadrao(): DateRange {
  const to = new Date();
  return { from: new Date(to.getFullYear(), to.getMonth(), 1), to };
}

function Financial() {
  const [date, setDate] = useState<DateRange | undefined>(periodoPadrao);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [receitas, setReceitas] = useState<SeriePeriodo | null>(null);
  const [despesasSerie, setDespesasSerie] = useState<SeriePeriodo | null>(null);
  const [formas, setFormas] = useState<ReceitasPorForma | null>(null);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [ultimos, setUltimos] = useState<UltimoPagamento[]>([]);

  const inicio = iso(date?.from ?? periodoPadrao().from!);
  const fim = iso(date?.to ?? date?.from ?? new Date());
  const agrupar: AgruparPeriodo =
    differenceInCalendarDays(new Date(`${fim}T12:00:00`), new Date(`${inicio}T12:00:00`)) > 45
      ? "mes"
      : "dia";

  const carregar = useCallback(async () => {
    setErro(null);
    const params = { inicio, fim, agrupar };

    try {
      const [resumoData, receitasData, despesasData, formasData, listaDespesas, ultimosData] =
        await Promise.all([
          buscarResumo(params),
          buscarReceitasPorPeriodo(params),
          buscarDespesasPorPeriodo(params),
          buscarReceitasPorForma(params),
          listarDespesas(params),
          buscarUltimosPagamentos(10),
        ]);

      setResumo(resumoData);
      setReceitas(receitasData);
      setDespesasSerie(despesasData);
      setFormas(formasData);
      setDespesas(listaDespesas);
      setUltimos(ultimosData.itens);
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível carregar o financeiro."));
    } finally {
      setCarregando(false);
    }
  }, [agrupar, fim, inicio]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const serieCombinada = useMemo(() => {
    const inicioDate = new Date(`${inicio}T12:00:00`);
    const fimDate = new Date(`${fim}T12:00:00`);
    const eixos =
      agrupar === "mes"
        ? eachMonthOfInterval({ start: inicioDate, end: fimDate }).map((d) => format(d, "yyyy-MM"))
        : eachDayOfInterval({ start: inicioDate, end: fimDate }).map((d) => format(d, "yyyy-MM-dd"));

    const mapaReceita = new Map(receitas?.itens.map((i) => [i.periodo, i.total]) ?? []);
    const mapaDespesa = new Map(despesasSerie?.itens.map((i) => [i.periodo, i.total]) ?? []);

    return eixos.map((periodo) => ({
      periodo,
      receitas: mapaReceita.get(periodo) ?? 0,
      despesas: mapaDespesa.get(periodo) ?? 0,
    }));
  }, [agrupar, despesasSerie, fim, inicio, receitas]);

  return (
    <div className="flex w-full flex-col gap-6">
      {/* o título já aparece no Header, aqui fica só a explicação */}
      <p className="text-sm text-muted-foreground">
        Receitas das O.S. finalizadas e despesas lançadas na mão
      </p>

      <FiltroPeriodo
        date={date}
        onDateChange={setDate}
        onLimpar={() => setDate(periodoPadrao())}
      />

      {carregando ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Carregando financeiro...</span>
        </div>
      ) : erro ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {erro}
        </p>
      ) : (
        <>
          {resumo && <CardsResumo resumo={resumo} />}

          <div className="grid gap-4 lg:grid-cols-5">
            <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-3">
              <h2 className="mb-4 text-base font-semibold">Receitas e despesas</h2>
              <GraficoReceitasDespesas dados={serieCombinada} agrupar={agrupar} />
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
              <h2 className="mb-4 text-base font-semibold">Por forma de pagamento</h2>
              <GraficoFormaPagamento itens={formas?.itens ?? []} />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
              <h2 className="mb-4 text-base font-semibold">Nova despesa</h2>
              <FormularioDespesa onCriada={carregar} />
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-semibold">Lançamentos do período</h3>
                <ListaDespesas despesas={despesas} onRemovida={carregar} />
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-3">
              <h2 className="mb-4 text-base font-semibold">Últimos pagamentos</h2>
              <TabelaUltimosPagamentos itens={ultimos} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Financial;
