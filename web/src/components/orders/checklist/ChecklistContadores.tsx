import { CheckCircle2, MinusCircle, XCircle } from "lucide-react";

interface ChecklistContadoresProps {
  contagem: { ok: number; naoOk: number; na: number };
}

function ChecklistContadores({ contagem }: ChecklistContadoresProps) {
  const cards = [
    { rotulo: "OK", valor: contagem.ok, icone: CheckCircle2, cor: "text-success" },
    { rotulo: "Não OK", valor: contagem.naoOk, icone: XCircle, cor: "text-destructive" },
    { rotulo: "N/A", valor: contagem.na, icone: MinusCircle, cor: "text-muted-foreground" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map(({ rotulo, valor, icone: Icone, cor }) => (
        <div
          key={rotulo}
          className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card px-3 py-4 sm:py-5"
        >
          <Icone className={`size-5 ${cor}`} />
          <span className="text-2xl font-bold tabular-nums sm:text-3xl">{valor}</span>
          <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">{rotulo}</span>
        </div>
      ))}
    </div>
  );
}

export default ChecklistContadores;