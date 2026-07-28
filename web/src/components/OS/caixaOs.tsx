import { Smartphone } from "lucide-react";
import StatusDeFinalizacaoDeServico from "./StatusDeOrdemDeServiso";

type Props = {
  numeroOs: string;
  status: "ABERTA" | "DIAGNOSTICO" | "EM_REPARO" | "FINALIZADO" ;
  cliente: string;
  modelo: string;
  data: string;
};

function CaixaOs({
  numeroOs,
  status,
  cliente,
  modelo,
  data,
}: Props) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-md">

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-500">
          #{numeroOs}
        </p>

        <StatusDeFinalizacaoDeServico status={status} />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
          <Smartphone className="text-orange-500" size={28} />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {cliente}
          </h2>

          <p className="truncate text-sm text-gray-500">
            {modelo}
          </p>

          <p className="text-xs text-gray-400">
            {data}
          </p>
        </div>
      </div>

    </div>
  );
}

export default CaixaOs;