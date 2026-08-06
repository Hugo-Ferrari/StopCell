
import BoxOs from "@/components/history/BoxOs";
import CaixaStatusOs from "@/components/orders/status/CaixaStatusOs";
import { listarOs } from "@/services/ordemServico.service";
import { Plus, Search } from "lucide-react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export interface OrdemServicoInterface {
  numOs: number;
  dtEntrada: string;
  status: "ABERTA" | "DIAGNOSTICO" | "EM_REPARO" | "FINALIZADO";

  cliente: {
    nmCompleto: string;
  };

  aparelho: {
    modelo: string;
  };
}

function OrdemServico() {
  const [busca, setBusca] = useState("");
  const [ordens, setOrdens] = useState<OrdemServicoInterface[]>([]);

  useEffect(() => {
    async function carregarOs() {
      try {
        const dados = await listarOs();
        setOrdens(dados);
      } catch (error) {
        console.log(error);
      }
    }

    carregarOs();
  }, []);

  return (
    <div className="flex flex-col gap-5">

      <div className="flex items-center rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition-colors focus-within:border-primary">

        <Search
          size={20}
          className="mr-3 text-muted-foreground"
        />

        <input
          type="text"
          name="buscaCliente"
          placeholder="Buscar O.S, Cliente ou aparelho"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none" />
      </div>


      <div className="grid grid-cols-2 gap-4">

        <CaixaStatusOs
          status="DIAGNOSTICO"
          quantidade={7}
        />

        <CaixaStatusOs
          status="FINALIZADO"
          quantidade={4}
        />

        <CaixaStatusOs
          status="EM_REPARO"
          quantidade={3}
        />

        <CaixaStatusOs
          status="ABERTA"
          quantidade={1}
        />

      </div>

      <BoxOs ordens={ordens} />

      <Link
        to="/nova-ordem-servico"
        className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary text-primary-foreground transition-all ml-auto -mt-15 z-50 "
      >
        <Plus size={28} />
      </Link>
    </div>
  );
}

export default OrdemServico;