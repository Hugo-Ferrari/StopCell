import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ATALHOS, type AtalhoPeriodo } from "@/utils/financeiro";
import { cn } from "@/lib/utils";

interface SeletorPeriodoProps {
  periodo: DateRange | undefined;
  // null quando a pessoa escolheu as datas na mão
  atalho: AtalhoPeriodo | null;
  onAtalho: (atalho: AtalhoPeriodo) => void;
  onPersonalizado: (periodo: DateRange | undefined) => void;
}

function textoDoPeriodo(periodo: DateRange | undefined) {
  if (!periodo?.from) return "Escolher datas";
  if (!periodo.to) return format(periodo.from, "dd/MM/yyyy");
  return `${format(periodo.from, "dd/MM")} – ${format(periodo.to, "dd/MM/yyyy")}`;
}

// os atalhos resolvem 90% dos casos; o calendário fica pra quando precisa de um período específico
function SeletorPeriodo({ periodo, atalho, onAtalho, onPersonalizado }: SeletorPeriodoProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="grid grid-cols-4 rounded-xl border border-border bg-card p-1">
        {ATALHOS.map((opcao) => (
          <button
            key={opcao.valor}
            type="button"
            onClick={() => onAtalho(opcao.valor)}
            aria-pressed={atalho === opcao.valor}
            className={cn(
              "rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors sm:text-sm",
              atalho === opcao.valor
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opcao.rotulo}
          </button>
        ))}
      </div>

      <Popover>
        <PopoverTrigger
          className={cn(
            "flex h-[42px] items-center justify-center gap-2 rounded-xl border px-3 text-sm transition-colors sm:justify-start",
            atalho === null
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          <CalendarDays className="size-4 shrink-0" />
          <span className="tabular-nums">{atalho === null ? textoDoPeriodo(periodo) : "Personalizado"}</span>
        </PopoverTrigger>
        <PopoverContent className="w-auto rounded-2xl border-border bg-popover p-0" align="end">
          <Calendar
            mode="range"
            defaultMonth={periodo?.from}
            selected={periodo}
            onSelect={onPersonalizado}
            numberOfMonths={2}
            locale={ptBR}
            className="bg-popover text-popover-foreground"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default SeletorPeriodo;