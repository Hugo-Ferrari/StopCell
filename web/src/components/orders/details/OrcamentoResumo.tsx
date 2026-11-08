import { Package, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatarMoeda } from "@/utils/moeda";

interface OrcamentoResumoProps {
  totalPecas: number;
  totalMaoDeObra: number;
  total: number;
}

function OrcamentoResumo({ totalPecas, totalMaoDeObra, total }: OrcamentoResumoProps) {
  const linhas = [
    { rotulo: "Peças", valor: totalPecas, icone: Package },
    { rotulo: "Mão de obra", valor: totalMaoDeObra, icone: Wrench },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Orçamento
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {linhas.map(({ rotulo, valor, icone: Icone }) => (
          <div key={rotulo} className="flex items-center gap-3 rounded-xl bg-muted/60 px-4 py-3">
            <Icone className="size-4 text-primary" />
            <span className="flex-1 text-sm font-medium">{rotulo}</span>
            <span className="text-sm font-semibold tabular-nums">{formatarMoeda(valor)}</span>
          </div>
        ))}

        <Separator className="my-1" />

        <div className="flex items-end justify-between gap-3">
          <span className="text-sm font-bold tracking-wider text-primary uppercase">Total</span>
          <span className="text-3xl font-bold tracking-tight text-primary tabular-nums">
            {formatarMoeda(total)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrcamentoResumo;