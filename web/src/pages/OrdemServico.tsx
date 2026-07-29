import CaixaOs from "@/components/OS/caixaOs";
import CaixaStatusOs from "@/components/OS/CaixaStatusOs";
import { listarOs } from "@/services/ordemServico.service";
import { Search } from "lucide-react";

import { useEffect, useState } from "react";

interface OrdemServicoInterface {
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
          className="
            flex-1
            bg-transparent
            text-foreground
            placeholder:text-muted-foreground
            outline-none
          "
        />
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

      
      <div className="mt-2 flex flex-col gap-4">

        {ordens.map((os) => (
          <CaixaOs
            key={os.numOs}
            numeroOs={String(os.numOs)}
            status={os.status}
            cliente={os.cliente.nmCompleto}
            modelo={os.aparelho.modelo}
            data={new Date(os.dtEntrada).toLocaleDateString("pt-BR")}
          />
        ))}

      </div>
    </div>
  );
}

export default OrdemServico;