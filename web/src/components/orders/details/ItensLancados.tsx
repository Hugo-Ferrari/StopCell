import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatarMoeda, paraNumero } from "@/utils/moeda";
import { subtotalItem } from "@/utils/orcamento";
import type { ItemOsInterface } from "@/types/ordemServico";

interface ItensLancadosProps {
  itens: ItemOsInterface[];
  vazio: string;
  podeRemover: boolean;
  onRemover: (idItemOs: number) => Promise<void>;
}

function ItensLancados({ itens, vazio, podeRemover, onRemover }: ItensLancadosProps) {
  const [removendo, setRemovendo] = useState<number | null>(null);

  async function handleRemover(idItemOs: number) {
    setRemovendo(idItemOs);
    try {
      await onRemover(idItemOs);
    } finally {
      setRemovendo(null);
    }
  }

  if (itens.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
        {vazio}
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
      {itens.map((item) => {
        const descricao = item.descricao || "Sem descrição";
        const quantidade = item.quantidade ?? 1;

        return (
          <li key={item.idItemOs} className="flex items-center gap-3 px-4 py-3">
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">{descricao}</span>
              <span className="text-xs text-muted-foreground">
                {quantidade} × {formatarMoeda(paraNumero(item.valorUnitario))}
              </span>
            </div>

            <span className="text-sm font-semibold tabular-nums">{formatarMoeda(subtotalItem(item))}</span>

            {podeRemover && (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Remover ${descricao}`}
                disabled={removendo !== null}
                onClick={() => handleRemover(item.idItemOs)}
                className="text-muted-foreground hover:text-destructive"
              >
                {removendo === item.idItemOs ? <Loader2 className="animate-spin" /> : <Trash2 />}
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default ItensLancados;