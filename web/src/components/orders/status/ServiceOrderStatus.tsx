type Props = {
  status: "ABERTA" | "DIAGNOSTICO" | "EM_REPARO" | "FINALIZADO";
};

function StatusDeFinalizacaoDeServico({ status }: Props) {
  const statusConfig = {
    ABERTA: {
      texto: "Aberta",
      classes:
        "bg-[color:var(--status-aberta)]/15 text-[color:var(--status-aberta)] border border-[color:var(--status-aberta)]/30",
    },
    DIAGNOSTICO: {
      texto: "Diagnóstico",
      classes:
        "bg-[color:var(--status-diagnostico)]/15 text-[color:var(--status-diagnostico)] border border-[color:var(--status-diagnostico)]/30",
    },
    EM_REPARO: {
      texto: "Em reparo",
      classes:
        "bg-[color:var(--status-reparo)]/15 text-[color:var(--status-reparo)] border border-[color:var(--status-reparo)]/30",
    },
    FINALIZADO: {
      texto: "Finalizado",
      classes:
        "bg-primary/15 text-primary border border-primary/30",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors ${config.classes}`}
    >
      {config.texto}
    </span>
  );
}

export default StatusDeFinalizacaoDeServico;