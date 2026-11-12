import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FiltroPeriodoProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  onLimpar: () => void;
}

function FiltroPeriodo({ date, onDateChange, onLimpar }: FiltroPeriodoProps) {
  const temFiltro = !!date?.from;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Popover>
        <PopoverTrigger
          className={cn(
            "flex h-[52px] w-full items-center justify-start rounded-2xl border border-border bg-card px-4 text-left font-normal text-foreground transition-colors hover:bg-accent sm:w-[300px]",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
              </>
            ) : (
              format(date.from, "dd/MM/yyyy")
            )
          ) : (
            <span>Filtrar por período</span>
          )}
        </PopoverTrigger>
        <PopoverContent
          className="w-auto rounded-2xl border-border bg-popover p-0 text-popover-foreground"
          align="start"
        >
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
          onClick={onLimpar}
          className="flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
          Mês atual
        </button>
      )}
    </div>
  );
}

export default FiltroPeriodo;
