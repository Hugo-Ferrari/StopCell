import { CheckCircle2, MinusCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StatusChecklist } from "@/services/osChecklistService";

interface StatusToggleProps {
  valor: StatusChecklist | null;
  onChange: (status: StatusChecklist) => void;
  rotuloItem: string;
}

const OPCOES = [
  {
    status: "OK" as const,
    texto: "OK",
    icone: CheckCircle2,
    ativo: "border-success/50 bg-success/10 text-success hover:bg-success/15",
  },
  {
    status: "NOK" as const,
    texto: "Não OK",
    icone: XCircle,
    ativo: "border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/15",
  },
  {
    status: "NA" as const,
    texto: "N/A",
    icone: MinusCircle,
    ativo: "border-foreground/30 bg-muted text-foreground hover:bg-muted",
  },
];

function StatusToggle({ valor, onChange, rotuloItem }: StatusToggleProps) {
  return (
    <div role="group" aria-label={`Estado de ${rotuloItem}`} className="flex gap-1.5">
      {OPCOES.map(({ status, texto, icone: Icone, ativo }) => {
        const marcado = valor === status;

        return (
          <Button
            key={status}
            type="button"
            variant="outline"
            aria-pressed={marcado}
            onClick={() => onChange(status)}
            className={cn(
              "h-9 rounded-full px-3 text-xs font-bold text-muted-foreground",
              marcado && ativo
            )}
          >
            <Icone className="size-3.5" />
            {texto}
          </Button>
        );
      })}
    </div>
  );
}

export default StatusToggle;