import { Link } from "react-router-dom";
import { Smartphone } from "lucide-react";
import type { GrupoHistorico } from "@/utils/groupHistory";
import { getStatusStyle } from "@/utils/statusStyle";

interface DeviceBoxProps {
  aparelhos: GrupoHistorico[];
}

export default function DeviceBox({ aparelhos }: DeviceBoxProps) {
  return (
    <div className="flex flex-col gap-4">
      {aparelhos.map(({ chave, ultimaOs, totalServicos }) => {
        const style = getStatusStyle(ultimaOs.status);
        return (
          <Link
            key={`aparelho-${chave}`}
            to={`/ordemServico/${ultimaOs.numOs}`}
            className="flex items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 sm:p-5 md:p-6 hover:border-primary/30 hover:bg-accent transition-colors group"
          >
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors">
                <Smartphone size={22} className="text-muted-foreground" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-foreground font-bold text-base md:text-lg leading-none mb-1.5">{ultimaOs.aparelho?.modelo || "Aparelho não informado"}</span>
                <span className="truncate text-muted-foreground text-xs md:text-sm">
                  {ultimaOs.cliente?.nmCompleto || "Cliente não informado"} • {totalServicos} {totalServicos === 1 ? "serviço" : "serviços"}
                </span>
              </div>
            </div>
            <div className={`flex shrink-0 items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border text-[10px] sm:text-xs font-bold tracking-wide ${style.bg} ${style.text}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></div>
              <span className="hidden sm:inline">{style.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
