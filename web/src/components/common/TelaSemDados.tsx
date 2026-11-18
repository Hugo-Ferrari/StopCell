import type { ReactNode } from "react";
import { FileWarning } from "lucide-react";

interface TelaSemDadosProps {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}

function TelaSemDados({ titulo, descricao, acao }: TelaSemDadosProps) {
  return (
    <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
      <FileWarning className="size-10 text-muted-foreground" />
      <div>
        <h2 className="text-lg font-bold text-foreground">{titulo}</h2>
        {descricao && <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}

export default TelaSemDados;
