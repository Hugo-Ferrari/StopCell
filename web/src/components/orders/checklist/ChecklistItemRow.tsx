import { Input } from "@/components/ui/input";
import StatusToggle from "./StatusToggle";
import type { ItemChecklistOs, StatusChecklist } from "@/services/osChecklistService";

interface ChecklistItemRowProps {
  item: ItemChecklistOs;
  onStatus: (status: StatusChecklist) => void;
  onObservacao: (observacao: string) => void;
}

function ChecklistItemRow({ item, onStatus, onObservacao }: ChecklistItemRowProps) {
  // a observação só aparece depois de marcar, senão a lista fica com 12 campos vazios
  const mostrarObservacao = item.status !== null || item.observacao !== "";

  return (
    <li className="flex flex-col gap-3 px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-semibold">{item.descricao}</span>
        <StatusToggle valor={item.status} onChange={onStatus} rotuloItem={item.descricao} />
      </div>

      {mostrarObservacao && (
        <Input
          placeholder={
            item.status === "NOK" ? "O que tem de errado? Ex.: trinco no canto superior" : "Observação (opcional)"
          }
          value={item.observacao}
          onChange={(e) => onObservacao(e.target.value)}
          className="h-10 bg-muted/40"
        />
      )}
    </li>
  );
}

export default ChecklistItemRow;