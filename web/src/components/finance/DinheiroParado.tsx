import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { PainelFinanceiro } from "@/services/financeiroService";
import { formatarMoeda } from "@/utils/moeda";
import { STATUS_OS } from "@/utils/statusOs";
import { cn } from "@/lib/utils";

interface DinheiroParadoProps {
  parado: PainelFinanceiro["parado"];
}

// não depende do período: é o que está na bancada agora e ainda não virou dinheiro
function DinheiroParado({ parado }: DinheiroParadoProps) {
  const total = parado.reduce((s, p) => s + p.total, 0);
  const quantidade = parado.reduce((s, p) => s + p.quantidade, 0);

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Dinheiro parado</h2>
          <p className="text-xs text-muted-foreground">orçamento das O.S. em aberto</p>
        </div>
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">agora</span>
      </div>

      {quantidade === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma O.S. em aberto.</p>
      ) : (
        <>
          <div>
            <p className="text-2xl font-semibold tracking-tight tabular-nums">{formatarMoeda(total)}</p>
            <p className="text-xs text-muted-foreground">em {quantidade} O.S. que ainda não foram entregues</p>
          </div>

          <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full">
            {parado.map((p) => (
              <div
                key={p.status}
                title={STATUS_OS[p.status].label}
                className={cn("h-full min-w-1 basis-0", STATUS_OS[p.status].dot)}
                // O.S. sem item lançado ainda conta pela quantidade, senão some da barra
                style={{ flexGrow: total > 0 ? p.total || 0.0001 : p.quantidade }}
              />
            ))}
          </div>

          {/* cada linha abre a lista de O.S. já filtrada naquele status */}
          <ul className="-mx-2 flex flex-col text-sm">
            {parado.map((p) => (
              <li key={p.status}>
                <Link
                  to={`/ordemServico?status=${p.status}`}
                  className="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted"
                >
                  <span className={cn("size-2 shrink-0 rounded-full", STATUS_OS[p.status].dot)} />
                  <span className="flex-1 text-muted-foreground group-hover:text-foreground">
                    {STATUS_OS[p.status].label} · {p.quantidade}
                  </span>
                  <span className="tabular-nums">{formatarMoeda(p.total)}</span>
                  <ChevronRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export default DinheiroParado;