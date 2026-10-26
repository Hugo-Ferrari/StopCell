import { Link } from "react-router-dom";
import { Smartphone } from "lucide-react";
import type { OrdemServicoInterface } from "@/pages/history/History";
import { getStatusStyle } from "@/utils/statusStyle";
import EmptyHistory from "@/components/history/EmptyHistory";

interface BoxOsProps {
  ordens: OrdemServicoInterface[];
}

export default function BoxOs({ ordens }: BoxOsProps) {
  return (
    <div className="flex flex-col gap-4">
      {ordens.length === 0 && (
        <EmptyHistory
          title="Nenhuma ordem de serviço encontrada."
          description="Tente alterar a busca ou o filtro selecionado."
        />
      )}
      {ordens.map((os) => {
        const style = getStatusStyle(os.status);
        return (
          <Link
            key={os.numOs}
            to={`/ordemServico/${os.numOs}`}
            className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-accent group sm:p-5 md:p-6"
          >
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors">
                <Smartphone size={22} className="text-muted-foreground" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-muted-foreground text-xs md:text-sm font-medium mb-0.5">
                  #{os.numOs}
                </span>
                <span className="truncate text-base font-bold leading-none text-foreground md:text-lg">
                  {os.cliente?.nmCompleto || "Cliente não informado"}
                </span>
                <span className="truncate text-xs text-muted-foreground md:text-sm">
                  {os.aparelho?.modelo || "Aparelho não informado"} •{" "}
                  {os.dtEntrada ? new Date(os.dtEntrada).toLocaleDateString("pt-BR") : "Sem data"}
                </span>
              </div>
            </div>
            <div
              className={`flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1.5 text-[10px] font-bold tracking-wide sm:px-3 sm:text-xs ${style.bg} ${style.text}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></div>
              <span className="hidden sm:inline">{style.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
