// Card “Não recebeu o código?”
import { type ReactNode } from "react";
import { VALIDADE_CODIGO_MIN } from "./constants";

interface RecoveryHelpCardProps {
  acao?: ReactNode;
}

function RecoveryHelpCard({ acao }: RecoveryHelpCardProps) {
  return (
    <aside className="rounded-2xl border border-border bg-card px-6 py-5">
      <h2 className="text-sm font-bold text-foreground">Não recebeu o código?</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Verifique sua caixa de spam ou lixo eletrônico. O código é válido por{" "}
        {VALIDADE_CODIGO_MIN} minutos.
      </p>
      {acao && <div className="mt-3">{acao}</div>}
    </aside>
  );
}

export default RecoveryHelpCard;