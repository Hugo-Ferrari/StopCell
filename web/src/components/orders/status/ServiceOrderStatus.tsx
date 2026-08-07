type Props = {
  status: "ABERTA" | "DIAGNOSTICO" | "EM_REPARO" | "FINALIZADO";
};

const statusConfig = {
  ABERTA: {
    texto: "Aberta",
    classes:
      "bg-[color:var(--status-aberta)]/15 text-[color:var(--status-aberta)] border-[color:var(--status-aberta)]/30",
  },
  DIAGNOSTICO: {
    texto: "Diagnóstico",
    classes:
      "bg-[color:var(--status-diagnostico)]/15 text-[color:var(--status-diagnostico)] border-[color:var(--status-diagnostico)]/30",
  },
  EM_REPARO: {
    texto: "Em reparo",
    classes:
      "bg-[color:var(--status-reparo)]/15 text-[color:var(--status-reparo)] border-[color:var(--status-reparo)]/30",
  },
  FINALIZADO: {
    texto: "Finalizado",
    classes:
      "bg-primary/15 text-primary border-primary/30",
  },
} as const;

function StatusDeFinalizacaoDeServico({ status }: Props) {
  const config = statusConfig[status];

  return (
    <span
      className={`  inline-flex items-center justify-center whitespace-nowrap  rounded-full  border  px-3  py-1 text-[11px] font-semibold tracking-wide transition-all duration-200 sm:px-4 sm:text-xs
        ${config.classes}
      `}
    >
      {config.texto}
    </span>
  );
}

export default StatusDeFinalizacaoDeServico;