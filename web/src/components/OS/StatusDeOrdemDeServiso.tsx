type Props = {
  status: "ABERTA" | "DIAGNOSTICO" | "EM_REPARO" | "FINALIZADO";
};

function StatusDeFinalizacaoDeServico({ status }: Props) {
  const statusConfig = {
    ABERTA: {
      texto: "Aberta",
      classes: "bg-green-100 text-green-700",
    },
    DIAGNOSTICO: {
      texto: "Diagnóstico",
      classes: "bg-yellow-100 text-yellow-700",
    },
    EM_REPARO: {
      texto: "Em reparo",
      classes: "bg-blue-100 text-blue-700",
    },
    FINALIZADO: {
      texto: "Finalizado",
      classes: "bg-red-100 text-red-700",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${config.classes}`}
    >
      {config.texto}
    </span>
  );
}

export default StatusDeFinalizacaoDeServico;