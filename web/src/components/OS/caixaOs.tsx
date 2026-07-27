import { Smartphone } from "lucide-react";
import StatusDeFinalizacaoDeServico from "./StatusDeOrdemDeServiso";

function CaixaOs() {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-5  transition hover:shadow-md ">

      
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-500">
          #OS-2345
        </p>

        <span>
          <StatusDeFinalizacaoDeServico status="FINALIZADO"/>
        </span>
        
      </div>

      
      <div className="flex items-center gap-4 mt-4">

        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
          <Smartphone className="text-orange-500" size={28} />
        </div>

        <div className="flex-1 ">
          <h2 className="ffont-semibold text-lg text-gray-800 truncate">
            Sofia Cueto {/** nome da cliente */}
          </h2>

          <p className="text-sm text-gray-500 truncate">
            iPhone 12 Pro Max {/*modelo do aparelho */}
          </p>

          <p className="text-sm text-gray-500 truncate">
            10/06/2026 {/**data */}
          </p>
        </div>

      </div>

    </div>
  );
}

export default CaixaOs;