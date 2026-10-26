import { Link } from "react-router-dom";
import type { GrupoHistorico } from "@/utils/groupHistory";

interface CostumerBoxProps {
  clientes: GrupoHistorico[];
}

export default function CostumerBox({ clientes }: CostumerBoxProps) {
  return (
    <div className="flex flex-col gap-4">
      {clientes.map(({ chave, ultimaOs, totalServicos }) => (
        <Link
          key={`cliente-${chave}`}
          to={`/ordemServico/${ultimaOs.numOs}`}
          className="flex items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 sm:p-5 md:p-6 hover:border-primary/30 hover:bg-accent transition-colors"
        >
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-lg">{ultimaOs.cliente?.nmCompleto?.charAt(0).toUpperCase() || "?"}</span>
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-foreground font-bold text-base md:text-lg leading-none mb-1.5">{ultimaOs.cliente?.nmCompleto || "Cliente não informado"}</span>
              <span className="truncate text-muted-foreground text-xs md:text-sm">
                Última O.S.: #{ultimaOs.numOs} • {ultimaOs.aparelho?.modelo || "Aparelho não informado"}
              </span>
            </div>
          </div>
          <div className="shrink-0 text-right text-muted-foreground text-xs md:text-sm font-medium">
            <span className="text-foreground font-bold text-sm md:text-base">{totalServicos}</span>{" "}
            {totalServicos === 1 ? "serviço" : "serviços"}
          </div>
        </Link>
      ))}
    </div>
  );
}
