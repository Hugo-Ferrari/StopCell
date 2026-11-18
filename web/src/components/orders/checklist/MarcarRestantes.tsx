import { CheckCircle2, MinusCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StatusChecklist } from "@/services/osChecklistService";

interface MarcarRestantesProps {
  pendentes: number;
  onMarcar: (status: StatusChecklist) => void;
}

const OPCOES = [
  { status: "OK" as const, texto: "OK", icone: CheckCircle2, cor: "hover:border-success/50 hover:text-success" },
  { status: "NOK" as const, texto: "Não OK", icone: XCircle, cor: "hover:border-destructive/50 hover:text-destructive" },
  { status: "NA" as const, texto: "N/A", icone: MinusCircle, cor: "hover:border-muted-foreground/50 hover:text-foreground" },
];

function MarcarRestantes({ pendentes, onMarcar }: MarcarRestantesProps) {
  if (pendentes === 0) return null;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border p-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-muted-foreground">
        Marcar {pendentes === 1 ? "o item sem marcar" : `os ${pendentes} itens sem marcar`} como:
      </span>
      <div className="flex gap-2">
        {OPCOES.map(({ status, texto, icone: Icone, cor }) => (
          <Button
            key={status}
            type="button"
            variant="outline"
            onClick={() => onMarcar(status)}
            className={`h-9 flex-1 rounded-xl px-3 text-muted-foreground sm:flex-none ${cor}`}
          >
            <Icone className="size-4" /> {texto}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default MarcarRestantes;
