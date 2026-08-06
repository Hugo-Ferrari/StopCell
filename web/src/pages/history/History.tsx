import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import BoxOs from "@/components/history/BoxOs";
import { listarOs } from "@/services/serviceOrderService";

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

function Historico() {
  const [busca, setBusca] = useState("");
  const [ordens, setOrdens] = useState<OrdemServicoInterface[]>([]);

  useEffect(() => {
    async function carregarOs() {
      const dados = await listarOs();
      setOrdens(dados);
    }

    carregarOs();
  }, []);

  return (
    <div>
      <div className="flex items-center gap-2 rounded-2xl border border-border p-2">
        <Search size={18} />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar O.S, Cliente ou Aparelho"
        />
      </div>

      <BoxOs ordens={ordens} />
      
    </div>
  );
}

export default Historico;