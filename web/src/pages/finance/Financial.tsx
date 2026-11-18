import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

import Alert from "@/components/common/Alert";
import { Skeleton } from "@/components/ui/skeleton";
import DespesasCard from "@/components/finance/DespesasCard";
import DinheiroParado from "@/components/finance/DinheiroParado";
import GraficoFormaPagamento from "@/components/finance/GraficoFormaPagamento";
import GraficoMeses from "@/components/finance/GraficoMeses";
import Indicadores from "@/components/finance/Indicadores";
import Insights from "@/components/finance/Insights";
import MapaMovimento from "@/components/finance/MapaMovimento";
import PorMarca from "@/components/finance/PorMarca";
import SeletorPeriodo from "@/components/finance/SeletorPeriodo";
import TabelaUltimosPagamentos from "@/components/finance/TabelaUltimosPagamentos";
import TopServicos from "@/components/finance/TopServicos";
import { useFinanceiro } from "@/hooks/useFinanceiro";
import { deIso, iso, periodoAnterior, periodoDoAtalho, type AtalhoPeriodo } from "@/utils/financeiro";
import { gerarInsights } from "@/utils/insightsFinanceiro";
import { cn } from "@/lib/utils";

function CarregandoFinanceiro() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-[136px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-[340px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[340px] rounded-xl" />
      </div>
    </div>
  );
}

function intervalo(inicio: string, fim: string) {
  if (inicio === fim) return format(deIso(inicio), "d 'de' MMMM", { locale: ptBR });
  return `${format(deIso(inicio), "dd/MM")} a ${format(deIso(fim), "dd/MM/yyyy")}`;
}

function Financial() {
  const [atalho, setAtalho] = useState<AtalhoPeriodo | null>("mes");
  const [periodo, setPeriodo] = useState<DateRange | undefined>(() => periodoDoAtalho("mes"));

  const hoje = new Date();
  const inicio = iso(periodo?.from ?? hoje);
  const fim = iso(periodo?.to ?? periodo?.from ?? hoje);
  const anterior = periodoAnterior(inicio, fim);
  const rotuloAnterior = `${format(deIso(anterior.inicio), "dd/MM")} a ${format(deIso(anterior.fim), "dd/MM")}`;

  const { dados, carregando, erro, recarregar } = useFinanceiro(inicio, fim);

  function escolherAtalho(novo: AtalhoPeriodo) {
    setAtalho(novo);
    setPeriodo(periodoDoAtalho(novo));
  }

  function escolherDatas(novo: DateRange | undefined) {
    setAtalho(null);
    setPeriodo(novo);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <header className="mb-2 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-muted-foreground tabular-nums">
          {intervalo(inicio, fim)} · comparando com {rotuloAnterior}
        </p>
        <SeletorPeriodo periodo={periodo} atalho={atalho} onAtalho={escolherAtalho} onPersonalizado={escolherDatas} />
      </header>

      <Alert mensagem={erro} />

      {carregando && !dados ? (
        <CarregandoFinanceiro />
      ) : (
        dados && (
          // trocando de período, a tela antiga fica apagadinha até a nova chegar
          <div className={cn("flex flex-col gap-4 transition-opacity", carregando && "opacity-60")}>
            <Indicadores resumo={dados.resumo} anterior={dados.resumoAnterior} tempoReparo={dados.painel.tempoReparo} />

            <div className="grid items-start gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <GraficoMeses meses={dados.painel.meses} />
              </div>
              <TopServicos servicos={dados.painel.servicos} />
            </div>

            <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
              <GraficoFormaPagamento itens={dados.formas.itens} />
              <MapaMovimento movimento={dados.painel.movimento} />
              <DinheiroParado parado={dados.painel.parado} />
              <PorMarca marcas={dados.painel.marcas} />
            </div>

            <Insights
              itens={gerarInsights({
                resumo: dados.resumo,
                anterior: dados.resumoAnterior,
                painel: dados.painel,
                rotuloAnterior,
              })}
            />

            <div className="grid items-start gap-4 lg:grid-cols-2">
              <DespesasCard despesas={dados.despesas} onAlterado={recarregar} />
              <TabelaUltimosPagamentos itens={dados.recebimentos} />
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default Financial;