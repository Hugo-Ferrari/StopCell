import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Bell, Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import BoxOs from "@/components/history/BoxOs";
import CustomerBox from "@/components/history/CustomerBox";
import DeviceBox from "@/components/history/DeviceBox";
import { listarOs } from "@/services/serviceOrderService";

export interface OrdemServicoInterface {
  numOs: number;
  dtEntrada: string;
  status: "ABERTA" | "DIAGNOSTICO" | "EM_REPARO" | "FINALIZADO";
  cliente: { nmCompleto: string; };
  aparelho: { modelo: string; };
}

export default function History() {
  const [abaAtiva, setAbaAtiva] = useState<"os" | "clientes" | "aparelhos">("os");
  const [busca, setBusca] = useState("");
  const [date, setDate] = useState<DateRange | undefined>();
  const [ordens, setOrdens] = useState<OrdemServicoInterface[]>([]);

  useEffect(() => {
    async function carregarOs() {
      const dados = await listarOs();
      setOrdens(dados);
    }
    carregarOs();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 sm:p-6 md:p-8 flex flex-col items-center font-sans overflow-x-hidden">

      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <div>
          <span className="text-[#F25C38] text-[10px] md:text-xs font-bold uppercase tracking-widest">
            Stop Cell
          </span>
          <h1 className="text-2xl md:text-3xl font-black mt-1 flex items-center gap-3 text-white">
            Histórico
            <Bell size={20} className="text-zinc-400 cursor-pointer hover:text-white transition-colors" />
          </h1>
        </div>
      </div>

      <div className="w-full max-w-5xl flex flex-col gap-6">

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-1 items-center bg-[#0A0A0A] border border-[#222222] rounded-2xl px-4 py-1.5 focus-within:border-[#F25C38] transition-colors">
            <Search size={20} className="text-zinc-500 mr-3" />
            <input
              type="text"
              placeholder="Buscar O.S., Cliente ou Aparelho..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-transparent p-2 text-sm md:text-base text-white outline-none"
            />
          </div>

          <Popover>
            <PopoverTrigger
              className={cn(
                "w-full md:w-[280px] flex items-center justify-start px-4 text-left font-normal bg-[#0A0A0A] border border-[#222222] text-zinc-400 hover:bg-[#141414] hover:text-white rounded-2xl h-[52px]",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
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
            <PopoverContent className="w-auto p-0 border-[#222222] bg-[#0A0A0A] text-white rounded-2xl" align="end">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={ptBR}
                className="bg-[#0A0A0A] text-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex w-full bg-[#0A0A0A] border border-[#222222] rounded-full p-1">
          <button onClick={() => setAbaAtiva("os")} className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${abaAtiva === "os" ? "bg-[#1C1C1C] text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}>O.S.</button>
          <button onClick={() => setAbaAtiva("clientes")} className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${abaAtiva === "clientes" ? "bg-[#1C1C1C] text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}>Clientes</button>
          <button onClick={() => setAbaAtiva("aparelhos")} className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${abaAtiva === "aparelhos" ? "bg-[#1C1C1C] text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}>Aparelhos</button>
        </div>

        <div className="flex flex-col gap-4">
          {abaAtiva === "os" && <BoxOs ordens={ordens} />}
          {abaAtiva === "clientes" && <CustomerBox ordens={ordens} />}
          {abaAtiva === "aparelhos" && <DeviceBox ordens={ordens} />}
        </div>
      </div>
    </div>
  );
}