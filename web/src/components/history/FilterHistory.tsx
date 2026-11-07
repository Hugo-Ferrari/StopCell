import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Calendar as CalendarIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FilterHistoryProps {
  busca: string;
  onBuscaChange: (busca: string) => void;
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
}

export default function FilterHistory({ busca, onBuscaChange, date, onDateChange }: FilterHistoryProps) {
  const temFiltro = busca.trim() !== "" || !!date?.from;

  function limparFiltros() {
    onBuscaChange("");
    onDateChange(undefined);
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex flex-1 items-center bg-card border border-border rounded-2xl px-4 py-1.5 focus-within:border-primary transition-colors">
        <Search size={20} className="text-muted-foreground mr-3 shrink-0" />
        <input
          type="text"
          placeholder="Buscar O.S., Cliente ou Aparelho..."
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
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
            onSelect={onDateChange}
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
  );
}
