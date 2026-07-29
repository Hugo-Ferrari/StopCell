type Props = {
  status: "ABERTA" | "DIAGNOSTICO" | "EM_REPARO" | "FINALIZADO";
  quantidade: number;
};

function CaixaStatusOs({ status, quantidade }: Props) {
  const statusConfig = {
    ABERTA: {
      texto: "ABERTA",
      cor: "bg-[var(--status-aberta)]",
    },
    DIAGNOSTICO: {
      texto: "EM DIAGN.",
      cor: "bg-[var(--status-diagnostico)]",
    },
    EM_REPARO: {
      texto: "EM REPARO",
      cor: "bg-[var(--status-reparo)]",
    },
    FINALIZADO: {
      texto: "FINALIZADO",
      cor: "bg-primary",
    },
  };

  const config = statusConfig[status];

  return (
    <button
      className="
        w-42
        rounded-2xl
        border
        border-border
        bg-card
        p-4
        text-left
        transition-all
        duration-200
        hover:border-primary/40
        hover:bg-accent
        hover:shadow-lg
      "
    >
      <div className="flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${config.cor}`} />

        <span className="text-sm font-semibold text-muted-foreground">
          {config.texto}
        </span>
      </div>

      <h1 className="mt-3 text-4xl font-bold text-foreground">
        {quantidade}
      </h1>
    </button>
  );
}

export default CaixaStatusOs;