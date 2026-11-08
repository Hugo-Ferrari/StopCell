import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OpcaoFiltro } from "@/utils/filtroOs";

interface OpcaoFiltroItemProps {
  opcao: OpcaoFiltro;
  quantidade: number;
  marcado: boolean;
  onAlternar: () => void;
}

function OpcaoFiltroItem({ opcao, quantidade, marcado, onAlternar }: OpcaoFiltroItemProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3.5 transition-colors",
        marcado ? "border-primary/50 bg-primary/5" : "border-border bg-card hover:bg-muted/60",
      )}
    >
      <input type="checkbox" checked={marcado} onChange={onAlternar} className="peer sr-only" />

      {/* checkbox desenhado na mão pra seguir o tema, o input de verdade fica escondido */}
      <span
        aria-hidden
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
          marcado ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/50 bg-background",
        )}
      >
        {marcado && <Check className="size-3.5" strokeWidth={3} />}
      </span>

      <span className={cn("size-2 shrink-0 rounded-full", opcao.cor)} />
      <span className="flex-1 text-[15px] font-medium text-foreground">{opcao.rotulo}</span>
      <span className="text-sm tabular-nums text-muted-foreground">{quantidade}</span>
    </label>
  );
}

export default OpcaoFiltroItem;