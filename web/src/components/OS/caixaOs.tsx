import { Smartphone } from "lucide-react";
import StatusDeFinalizacaoDeServico from "./StatusDeOrdemDeServiso";

type Props = {
  numeroOs: string;
  status: "ABERTA" | "DIAGNOSTICO" | "EM_REPARO" | "FINALIZADO";
  cliente: string;
  modelo: string;
  data: string;
};

function CaixaOs({
  numeroOs,
  status,
  cliente,
  modelo,
  data,
}: Props) {
  return (
    <div className="w-full rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-lg hover:border-primary/40">

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">
          #{numeroOs}
        </p>

        <StatusDeFinalizacaoDeServico status={status} />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Smartphone className="text-primary" size={28} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-foreground">
            {cliente}
          </h2>

          <p className="truncate text-sm text-muted-foreground">
            {modelo}
          </p>

          <p className="text-xs text-[var(--text-muted)]">
            {data}
          </p>
        </div>
      </div>

    </div>
  );
}

export default CaixaOs;