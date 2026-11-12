import { useState } from "react";
import { format } from "date-fns";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Despesa } from "@/services/financeiroService";
import { removerDespesa } from "@/services/financeiroService";
import { mensagemDeErro } from "@/utils/apiError";
import { formatarMoeda } from "@/utils/moeda";

interface ListaDespesasProps {
  despesas: Despesa[];
  onRemovida: () => Promise<void>;
}

function ListaDespesas({ despesas, onRemovida }: ListaDespesasProps) {
  const [removendo, setRemovendo] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function handleRemover(idDespesa: number) {
    setErro(null);
    setRemovendo(idDespesa);
    try {
      await removerDespesa(idDespesa);
      await onRemovida();
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível apagar a despesa."));
    } finally {
      setRemovendo(null);
    }
  }

  if (despesas.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhuma despesa neste período.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {despesas.map((despesa) => (
        <div
          key={despesa.idDespesa}
          className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{despesa.descricao}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(despesa.dataDespesa), "dd/MM/yyyy")} · {formatarMoeda(despesa.valor)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => void handleRemover(despesa.idDespesa)}
            disabled={removendo === despesa.idDespesa}
            aria-label="Apagar despesa"
          >
            {removendo === despesa.idDespesa ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4 text-destructive" />
            )}
          </Button>
        </div>
      ))}
      {erro && <p className="text-xs text-destructive">{erro}</p>}
    </div>
  );
}

export default ListaDespesas;
