import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";

import BoxOs from "@/components/history/BoxOs";
import CustomerBox from "@/components/history/CustomerBox";
import DeviceBox from "@/components/history/DeviceBox";
import EmptyHistory from "@/components/history/EmptyHistory";
import FilterHistory from "@/components/history/FilterHistory";
import { filtrarOrdens } from "@/utils/filterHistory";
import { agruparPorAparelho, agruparPorCliente } from "@/utils/groupHistory";
import { listarOs } from "@/services/serviceOrderService";

export interface OrdemServicoInterface {
  numOs: number;
  cpfCliente: string;
  imeiAparelho: string;
  dtEntrada: string | null;
  status: "ABERTA" | "DIAGNOSTICO" | "EM_REPARO" | "FINALIZADO";
  cliente: { nmCompleto: string; };
  aparelho: { modelo: string; };
}

type Aba = "os" | "clientes" | "aparelhos";

export default function History() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>("os");
  const [busca, setBusca] = useState("");
  const [date, setDate] = useState<DateRange | undefined>();
  const [ordens, setOrdens] = useState<OrdemServicoInterface[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregarOs() {
      try {
        const dados = await listarOs();
        setOrdens(dados);
      } catch {
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }
    carregarOs();
  }, []);

  const ordensFiltradas = useMemo(() => filtrarOrdens(ordens, busca, date), [ordens, busca, date]);

  const clientes = useMemo(() => agruparPorCliente(ordensFiltradas), [ordensFiltradas]);
  const aparelhos = useMemo(() => agruparPorAparelho(ordensFiltradas), [ordensFiltradas]);

  const abas: { id: Aba; label: string; total: number }[] = [
    { id: "os", label: "O.S.", total: ordensFiltradas.length },
    { id: "clientes", label: "Clientes", total: clientes.length },
    { id: "aparelhos", label: "Aparelhos", total: aparelhos.length },
  ];

  const temFiltro = busca.trim() !== "" || !!date?.from;
  const totalAbaAtiva = abas.find((aba) => aba.id === abaAtiva)?.total ?? 0;

  function renderConteudo() {
    if (carregando) {
      return (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Carregando histórico...</span>
        </div>
      );
    }

    if (erro) {
      return (
        <EmptyHistory
          title="Não foi possível carregar o histórico."
          description="Verifique sua conexão e recarregue a página."
        />
      );
    }

    if (totalAbaAtiva === 0) {
      return temFiltro ? (
        <EmptyHistory
          title="Nenhum resultado encontrado."
          description="Tente alterar a busca ou o período selecionado."
        />
      ) : (
        <EmptyHistory
          title="Nenhuma ordem de serviço registrada ainda."
          description="As ordens de serviço criadas aparecerão aqui."
        />
      );
    }

    if (abaAtiva === "clientes") return <CustomerBox clientes={clientes} />;
    if (abaAtiva === "aparelhos") return <DeviceBox aparelhos={aparelhos} />;
    return <BoxOs ordens={ordensFiltradas} />;
  }

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Cabeçalho da página */}
      <div>
        <span className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
          Stop Cell
        </span>
        <h1 className="text-2xl md:text-3xl font-bold mt-1 text-foreground">
          Histórico
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Consulte as ordens de serviço, clientes e aparelhos atendidos
        </p>
      </div>

      {/* Busca e filtro por período */}
      <FilterHistory busca={busca} onBuscaChange={setBusca} date={date} onDateChange={setDate} />

      {/* Abas */}
      <div className="flex w-full bg-card border border-border rounded-full p-1">
        {abas.map((aba) => (
          <button
            key={aba.id}
            type="button"
            onClick={() => setAbaAtiva(aba.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all duration-300",
              abaAtiva === aba.id
                ? "bg-accent text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {aba.label}
            {!carregando && !erro && (
              <span
                className={cn(
                  "min-w-6 rounded-full px-1.5 py-0.5 text-[10px] sm:text-xs font-bold",
                  abaAtiva === aba.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {aba.total}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-4">{renderConteudo()}</div>
    </div>
  );
}
