type Props = {
  status: "FINALIZADO" | "DIAGNOSTICO" | "EM_REPARO" | "AGUARDANDO_PECA";
  quantidade: number;
};

function CaixaStatusOs({ status, quantidade }: Props) {
  const statusConfig = {
    FINALIZADO: {
      texto: "FINALIZADO",
      cor: "bg-green-500",
      
      
    },
    DIAGNOSTICO: {
      texto: "EM DIAGN.",
      cor: "bg-yellow-400",
      
     
    },
    EM_REPARO: {
      texto: "EM REPARO",
      cor: "bg-blue-500",
      
      
    },
    AGUARDANDO_PECA: {
      texto: "AGUARD. PEÇA",
      cor: "bg-red-500",
      
      
    },
  };

  const config = statusConfig[status];

  return (
    <button
      className={`w-42  rounded-2xl border-1 p-4 text-left transition-all  `}>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${config.cor}`} />

        <span className={`text-sm font-semibold text-gray-500 `}>
          {config.texto}
        </span>
      </div>

      <h1 className="mt-3 text-4xl font-bold text-black">
        {quantidade}
      </h1>
    </button>
  );
}

export default CaixaStatusOs;