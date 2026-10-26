import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Calendar as CalendarIcon, Loader2, X } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import BoxOs from "@/components/history/BoxOs";
import CustomerBox from "@/components/history/CustomerBox";
import DeviceBox from "@/components/history/DeviceBox";
import EmptyHistory from "@/components/history/EmptyHistory";
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

// Deixa a busca sem diferenciar maiúsculas nem acentos ("joao" encontra "João")
function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function dentroDoPeriodo(dtEntrada: string | null, periodo: DateRange | undefined) {
  if (!periodo?.from) return true;
  if (!dtEntrada) return false;

  const data = new Date(dtEntrada);
  const inicio = new Date(periodo.from);
  inicio.setHours(0, 0, 0, 0);
  const fim = new Date(periodo.to ?? periodo.from);
  fim.setHours(23, 59, 59, 999);

  return data >= inicio && data <= fim;
}

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

  const ordensFiltradas = useMemo(() => {
    const termo = normalizar(busca.trim());

    return ordens.filter((os) => {
      if (!dentroDoPeriodo(os.dtEntrada, date)) return false;
      if (!termo) return true;

      return [String(os.numOs), os.cliente?.nmCompleto ?? "", os.aparelho?.modelo ?? ""]
        .some((campo) => normalizar(campo).includes(termo));
    });
  }, [ordens, busca, date]);

  const clientes = useMemo(() => agruparPorCliente(ordensFiltradas), [ordensFiltradas]);
  const aparelhos = useMemo(() => agruparPorAparelho(ordensFiltradas), [ordensFiltradas]);

  const abas: { id: Aba; label: string; total: number }[] = [
    { id: "os", label: "O.S.", total: ordensFiltradas.length },
    { id: "clientes", label: "Clientes", total: clientes.length },
    { id: "aparelhos", label: "Aparelhos", total: aparelhos.length },
  ];

  const temFiltro = busca.trim() !== "" || !!date?.from;
  const totalAbaAtiva = abas.find((aba) => aba.id === abaAtiva)?.total ?? 0;

  function limparFiltros() {
    setBusca("");
    setDate(undefined);
  }

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
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-1 items-center bg-card border border-border rounded-2xl px-4 py-1.5 focus-within:border-primary transition-colors">
          <Search size={20} className="text-muted-foreground mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Buscar O.S., Cliente ou Aparelho..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-transparent p-2 text-sm md:text-base text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        <Popover>
          <PopoverTrigger
            className={cn(
              "w-full md:w-[280px] flex items-center justify-start px-4 text-left font-normal bg-card border border-border text-foreground hover:bg-accent rounded-2xl h-[52px] transition-colors",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            {date?.from ? (
              date.to ? (
                <>{format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}</>
              ) : (
                format(date.from, "dd/MM/yyyy")
              )
            ) : (
              <span>Filtrar por período</span>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-border bg-popover text-popover-foreground rounded-2xl" align="end">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              locale={ptBR}
              className="bg-popover text-popover-foreground"
            />
          </PopoverContent>
        </Popover>

        {temFiltro && (
          <button
            type="button"
            onClick={limparFiltros}
            className="flex items-center justify-center gap-2 h-[52px] px-4 rounded-2xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
            Limpar filtros
          </button>
        )}
      </div>

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
