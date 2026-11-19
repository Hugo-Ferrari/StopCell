import type { CSSProperties } from "react";
import type { PainelFinanceiro } from "@/services/financeiroService";
import { formatarMoeda } from "@/utils/moeda";
import { porcentagem } from "@/utils/financeiro";
import { cn } from "@/lib/utils";

interface PorMarcaProps {
  marcas: PainelFinanceiro["marcas"];
}

// da maior pra menor: laranja, depois cinzas cada vez mais claros
const CORES = [
  "bg-primary text-white",
  "bg-foreground/80 text-background",
  "bg-foreground/55 text-background",
  "bg-foreground/30 text-foreground",
  "bg-foreground/15 text-foreground",
];

interface Bloco {
  marca: string;
  total: number;
  pct: number;
}

// 4 maiores e o resto junto em "Outras", pra não virar um monte de quadradinho
function agrupar(marcas: PorMarcaProps["marcas"]): Bloco[] {
  const total = marcas.reduce((s, m) => s + m.total, 0);
  const principais = marcas.slice(0, 4);
  const resto = marcas.slice(4).reduce((s, m) => s + m.total, 0);
  const lista = resto > 0 ? [...principais, { marca: "Outras", total: resto }] : principais;
  return lista.map((m) => ({ ...m, pct: porcentagem(m.total, total) }));
}

function Quadro({ bloco, indice, style, grande }: { bloco: Bloco; indice: number; style?: CSSProperties; grande?: boolean }) {
  return (
    <div
      title={`${bloco.marca}: ${formatarMoeda(bloco.total)}`}
      style={style}
      className={cn(
        "flex min-h-7 min-w-0 overflow-hidden rounded-md p-2.5 text-xs",
        grande ? "flex-col justify-between" : "items-start justify-between gap-2",
        CORES[indice] ?? CORES[CORES.length - 1],
      )}
    >
      <span className="truncate font-medium">{bloco.marca}</span>
      <span className="shrink-0 tabular-nums opacity-90">
        {bloco.pct}%
        {grande && <span className="mt-0.5 block text-sm font-semibold">{formatarMoeda(bloco.total)}</span>}
      </span>
    </div>
  );
}

function PorMarca({ marcas }: PorMarcaProps) {
  const blocos = agrupar(marcas);
  const [maior, ...resto] = blocos;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 md:p-6">
      <div>
        <h2 className="font-semibold">Por marca</h2>
        <p className="text-xs text-muted-foreground">faturamento do período</p>
      </div>

      {!maior ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma O.S. finalizada no período.</p>
      ) : (
        <div className="flex h-48 gap-1">
          <Quadro
            bloco={maior}
            indice={0}
            grande
            style={resto.length > 0 ? { flexBasis: `${Math.min(70, Math.max(38, maior.pct))}%` } : { flex: 1 }}
          />
          {resto.length > 0 && (
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {resto.map((bloco, i) => (
                <Quadro key={bloco.marca} bloco={bloco} indice={i + 1} style={{ flexGrow: bloco.total, flexBasis: 0 }} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default PorMarca;