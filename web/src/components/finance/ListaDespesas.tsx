import { useState } from "react";
import { format } from "date-fns";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removerDespesa, type Despesa } from "@/services/financeiroService";
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
    return <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma despesa no período.</p>;
  }

  return (
    <div className="flex flex-col">
      <ul className="-mx-2 flex flex-col">
        {despesas.map((despesa) => (
          <li
            key={despesa.idDespesa}
            className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
          >
            <div className="min-w-0">
              <p className="truncate text-sm">{despesa.descricao}</p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {format(new Date(despesa.dataDespesa), "dd/MM/yyyy")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <span className="text-sm font-medium text-destructive tabular-nums">− {formatarMoeda(despesa.valor)}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => void handleRemover(despesa.idDespesa)}
                disabled={removendo === despesa.idDespesa}
                aria-label="Apagar despesa"
                className="text-muted-foreground hover:text-destructive"
              >
                {removendo === despesa.idDespesa ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </Button>
            </div>
          </li>
        ))}
      </ul>
      {erro && <p className="mt-2 text-xs text-destructive">{erro}</p>}
    </div>
  );
}

export default ListaDespesas;