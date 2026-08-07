type Props = {
  status: "ABERTA" | "DIAGNOSTICO" | "EM_REPARO" | "FINALIZADO";
  quantidade: number;
};

const statusConfig = {
  ABERTA: {
    texto: "Aberta",
    cor: "bg-[var(--status-aberta)]",
  },
  DIAGNOSTICO: {
    texto: "Diagnóstico",
    cor: "bg-[var(--status-diagnostico)]",
  },
  EM_REPARO: {
    texto: "Em reparo",
    cor: "bg-[var(--status-reparo)]",
  },
  FINALIZADO: {
    texto: "Finalizado",
    cor: "bg-primary",
  },
} as const;

function CaixaStatusOs({ status, quantidade }: Props) {
  const config = statusConfig[status];

  return (
    <button
      className=" group w-full rounded-2xl border  border-border bg-cardp-5  text-left  shadow-sm  transition-all  duration-300  hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <div className="flex items-center gap-3">
        <div
          className={`h-3 w-3 rounded-full transition-transform duration-300 group-hover:scale-125 ${config.cor}`}
        />

        <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {config.texto}
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          {quantidade}
        </h2>

        <span className="text-xs text-muted-foreground">
          Ordens
        </span>
      </div>
    </button>
  );
}

export default CaixaStatusOs;