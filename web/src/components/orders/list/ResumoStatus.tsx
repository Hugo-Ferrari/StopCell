import { cn } from "@/lib/utils";
import { OPCOES_FILTRO, type FiltroOs } from "@/utils/filtroOs";

interface ResumoStatusProps {
  contagem: Record<FiltroOs, number>;
  aplicados: FiltroOs[];
  onSelecionar: (filtro: FiltroOs) => void;
}

// os quatro que a loja mais acompanha no dia a dia. o resto fica no filtro
const STATUS_DOS_CARDS: FiltroOs[] = ["DIAGNOSTICO", "AGUARDANDO_PECA", "EM_REPARO", "FINALIZADO"];
const CARDS = OPCOES_FILTRO.filter((opcao) => STATUS_DOS_CARDS.includes(opcao.valor));

function ResumoStatus({ contagem, aplicados, onSelecionar }: ResumoStatusProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {CARDS.map((card) => {
        const ativo = aplicados.length === 1 && aplicados[0] === card.valor;

        return (
          <button
            key={card.valor}
            type="button"
            onClick={() => onSelecionar(card.valor)}
            aria-pressed={ativo}
            className={cn(
              "flex min-h-[90px] flex-col justify-between rounded-2xl border bg-card p-4 text-left transition-colors md:min-h-[110px] md:p-5",
              ativo ? "border-primary" : "border-border hover:border-primary/40",
            )}
          >
            <span className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase md:text-[11px]">
              <span className={cn("size-1.5 rounded-full md:size-2", card.cor)} />
              {card.rotulo}
            </span>
            <span className="mt-2 text-2xl font-bold text-foreground tabular-nums md:text-3xl">
              {contagem[card.valor] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default ResumoStatus;