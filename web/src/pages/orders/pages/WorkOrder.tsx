import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import BoxOs from "@/components/history/BoxOs";
import Alert from "@/components/common/Alert";
import { Skeleton } from "@/components/ui/skeleton";
import BuscaOs from "@/components/orders/list/BuscaOs";
import FiltroStatusDialog from "@/components/orders/list/FiltroStatusDialog";
import FiltrosAtivos from "@/components/orders/list/FiltrosAtivos";
import ResumoStatus from "@/components/orders/list/ResumoStatus";
import { useListaOrdens } from "@/hooks/useListaOrdens";
import { contarPorFiltro, filtrarOrdens, type FiltroOs } from "@/utils/filtroOs";

function OrdemServico() {
  const { ordens, carregando, erro } = useListaOrdens();
  const [busca, setBusca] = useState("");
  const [filtros, setFiltros] = useState<FiltroOs[]>([]);

  const contagem = useMemo(() => contarPorFiltro(ordens), [ordens]);
  const ordensFiltradas = useMemo(() => filtrarOrdens(ordens, filtros, busca), [ordens, filtros, busca]);

  // clicar no card filtra só aquele status; clicar de novo tira o filtro
  function selecionarCard(filtro: FiltroOs) {
    setFiltros((atual) => (atual.length === 1 && atual[0] === filtro ? [] : [filtro]));
  }

  function removerFiltro(filtro: FiltroOs) {
    setFiltros((atual) => atual.filter((f) => f !== filtro));
  }

  return (
    <div className="flex min-h-screen w-full flex-col gap-6 bg-background p-4 text-foreground md:gap-8 md:p-8">
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-primary uppercase md:text-xs">Stop Cell</span>
          <h1 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">Ordens de Serviço</h1>
        </div>

        <Link
          to="/nova-ordem-servico"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
        >
          <Plus size={18} strokeWidth={2.5} /> Nova O.S.
        </Link>
      </header>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2 md:gap-4">
          <BuscaOs valor={busca} onChange={setBusca} />
          <FiltroStatusDialog aplicados={filtros} contagem={contagem} onAplicar={setFiltros} />
        </div>
        <FiltrosAtivos aplicados={filtros} onRemover={removerFiltro} onLimpar={() => setFiltros([])} />
      </div>

      <ResumoStatus contagem={contagem} aplicados={filtros} onSelecionar={selecionarCard} />

      <Alert mensagem={erro} />

      {carregando ? (
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[88px] rounded-2xl" />
          ))}
        </div>
      ) : (
        <BoxOs ordens={ordensFiltradas} />
      )}
    </div>
  );
}

export default OrdemServico;