import { Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import StatusDeFinalizacaoDeServico from "./ServiceOrderStatus";

type Props = {
  numeroOs: string;
  status: "ABERTA" | "DIAGNOSTICO" | "EM_REPARO" | "FINALIZADO";
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
    <Link
      to={`/ordemServico/${numeroOs}`}
      className=" group block w-full  rounded-2xl  border  border-border  bg-card  p-5  shadow-sm  transition-all  duration-300  hover:-translate-y-1  hover:border-primary/40 hover:shadow-xl ">
      
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Ordem de Serviço
          </p>

          <p className="font-bold text-foreground">
            #{numeroOs}
          </p>
        </div>

        <StatusDeFinalizacaoDeServico status={status} />
      </div>

     
      <div className="mt-6 flex items-center gap-4">
        <div
          className=" flex h-14 w-14 shrink-0 items-center justify-center  rounded-xl   bg-primary/10   transition-colors  group-hover:bg-primary/20"
        >
          <Smartphone
            size={28}
            className="text-primary"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-foreground">
            {cliente}
          </h2>

          <p className="truncate text-sm text-muted-foreground">
            {modelo}
          </p>
        </div>
      </div>

      
      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Entrada em
        </p>

        <p className="text-sm font-medium text-foreground">
          {data}
        </p>
      </div>
    </Link>
  );
}

export default CaixaOs;