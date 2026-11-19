import type { PainelFinanceiro } from "@/services/financeiroService";
import { formatarMoeda } from "@/utils/moeda";
import { porcentagem } from "@/utils/financeiro";
import { cn } from "@/lib/utils";

interface TopServicosProps {
  servicos: PainelFinanceiro["servicos"];
}

function TopServicos({ servicos }: TopServicosProps) {
  const maior = servicos.itens[0]?.total ?? 0;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 md:p-6">
      <div>
        <h2 className="font-semibold">O que mais fatura</h2>
        <p className="text-xs text-muted-foreground">serviços e peças das O.S. finalizadas</p>
      </div>

      {servicos.itens.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma O.S. finalizada no período.</p>
      ) : (
        <ul className="flex flex-col gap-3.5">
          {servicos.itens.map((item, indice) => (
            <li key={item.descricao} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate">
                  {item.descricao}
                  {item.tipo === "PECA" && (
                    <span className="ml-1.5 rounded bg-muted px-1 py-px text-[10px] text-muted-foreground">peça</span>
                  )}
                </span>
                <span className="shrink-0 font-medium tabular-nums">{formatarMoeda(item.total)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", indice === 0 ? "bg-primary" : "bg-muted-foreground/40")}
                    style={{ width: `${(item.total / maior) * 100}%` }}
                  />
                </div>
                <span className="w-24 shrink-0 text-right text-[11px] text-muted-foreground tabular-nums">
                  {item.quantidadeOs} O.S. · {porcentagem(item.total, servicos.totalGeral)}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default TopServicos;