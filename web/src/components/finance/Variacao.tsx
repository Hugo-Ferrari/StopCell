import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface VariacaoProps {
  // diferença pro período anterior: em % pra dinheiro, em pontos ou dias pro resto
  delta: number | null;
  formatar: (valorAbsoluto: number) => string;
  // em despesa e tempo de reparo, subir é ruim
  subirEhBom?: boolean;
}

function Variacao({ delta, formatar, subirEhBom = true }: VariacaoProps) {
  if (delta === null) {
    return <span className="text-xs text-muted-foreground">sem dado anterior</span>;
  }

  if (Math.abs(delta) < 0.05) {
    return <span className="text-xs text-muted-foreground">igual ao período anterior</span>;
  }

  const subiu = delta > 0;
  const Seta = subiu ? ArrowUp : ArrowDown;

  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <span
        className={cn(
          "flex items-center gap-0.5 font-medium tabular-nums",
          subiu === subirEhBom ? "text-success" : "text-destructive",
        )}
      >
        <Seta className="size-3.5" strokeWidth={2.5} />
        {formatar(Math.abs(delta))}
      </span>
      vs. anterior
    </span>
  );
}

export default Variacao;