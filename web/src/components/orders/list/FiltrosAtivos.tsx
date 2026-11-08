import { X } from "lucide-react";
import { OPCOES_FILTRO, type FiltroOs } from "@/utils/filtroOs";
import { cn } from "@/lib/utils";

interface FiltrosAtivosProps {
  aplicados: FiltroOs[];
  onRemover: (filtro: FiltroOs) => void;
  onLimpar: () => void;
}

// mostra o que está filtrado embaixo da busca, pra ninguém achar que sumiu O.S.
function FiltrosAtivos({ aplicados, onRemover, onLimpar }: FiltrosAtivosProps) {
  if (aplicados.length === 0) return null;

  const ativos = OPCOES_FILTRO.filter((opcao) => aplicados.includes(opcao.valor));

  return (
    <div className="flex flex-wrap items-center gap-2">
      {ativos.map((opcao) => (
        <button
          key={opcao.valor}
          type="button"
          onClick={() => onRemover(opcao.valor)}
          className="flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pr-2 pl-3 text-xs font-medium text-foreground transition-colors hover:border-primary/40 md:text-sm"
        >
          <span className={cn("size-1.5 rounded-full", opcao.cor)} />
          {opcao.rotulo}
          <X size={14} className="text-muted-foreground" />
        </button>
      ))}

      <button
        type="button"
        onClick={onLimpar}
        className="px-2 text-xs font-medium text-primary hover:underline md:text-sm"
      >
        Limpar tudo
      </button>
    </div>
  );
}

export default FiltrosAtivos;