import { Link } from "react-router-dom";
import { RotateCcw, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import OsStatusBadge from "./OsStatusBadge";
import type { OrdemDetalheInterface } from "@/types/ordemServico";

interface OsResumoCardProps {
  ordem: OrdemDetalheInterface;
}

function formatarEntrada(data?: string) {
  if (!data) return "Sem data";

  const dt = new Date(data);
  return `${dt.toLocaleDateString("pt-BR")} às ${dt.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function OsResumoCard({ ordem }: OsResumoCardProps) {
  const dados = [
    { rotulo: "Cliente", valor: ordem.cliente?.nmCompleto || "Não informado" },
    { rotulo: "Modelo", valor: ordem.aparelho?.modelo || "Não informado" },
    { rotulo: "IMEI", valor: ordem.aparelho?.imei || "Não informado" },
    { rotulo: "Entrada", valor: formatarEntrada(ordem.dtEntrada) },
  ];

  return (
    <Card className="flex-row items-start gap-4 px-5 sm:gap-5 sm:px-6">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border-2 border-primary text-primary sm:size-16">
        <Smartphone className="size-6 sm:size-7" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold sm:text-2xl">#OS {ordem.numOs}</h2>
          <OsStatusBadge status={ordem.status} />
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm sm:grid-cols-[auto_1fr_auto_1fr]">
          {dados.map((item) => (
            <div key={item.rotulo} className="contents">
              <dt className="font-medium text-muted-foreground">{item.rotulo}</dt>
              <dd className="truncate">{item.valor}</dd>
            </div>
          ))}
        </dl>

        {ordem.numOsAnterior && (
          <Link
            to={`/ordemServico/${ordem.numOsAnterior}`}
            className="flex w-fit items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <RotateCcw className="size-3.5" />
            Retrabalho da O.S. #{ordem.numOsAnterior}
          </Link>
        )}
      </div>
    </Card>
  );
}

export default OsResumoCard;