import CaixaOs from '@/components/OS/caixaOs'
import CaixaStatusOs from '@/components/OS/CaixaStatusOs'
import { listarOs } from '@/services/ordemServico.service';
import { Search } from 'lucide-react';

import React, { useEffect, useState } from 'react'
interface OrdemServicoInterface {
  numOs: number;
  dtEntrada: string;
  status: "ABERTA" | "DIAGNOSTICO" | "EM_REPARO" | "FINALIZADO" ;

  cliente: {
    nmCompleto: string;
  };

  aparelho: {
    modelo: string;
  };
}
function OrdemServico() {
  const [busca, setBusca] = useState("")
  const [ordens, setOrdens] = useState<OrdemServicoInterface[]>([])

  useEffect(() => {
    async function carregarOs() {
      try {
        const dados = await listarOs()
        setOrdens(dados)
      }
      catch (error) {
        console.log(error)
      }

    }
    carregarOs()
  }, [])
  return (
    <div className=" flex-col ">
      <div className='flex mb-3 p-2 border-1 rounded-2xl'>
        <Search size={25} className='mr-2 text-gray-500' />
        <input type="text" name='buscaCliente' placeholder='Buscar O.S, Cliente ou aparelho'
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className='active:border-none ' />
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-auto h-auto ">
        <CaixaStatusOs status="DIAGNOSTICO" quantidade={7} />
        <CaixaStatusOs status="FINALIZADO" quantidade={4} />
        <CaixaStatusOs status="EM_REPARO" quantidade={3} />
        <CaixaStatusOs status="ABERTA" quantidade={1} />
      </div>

      <div className="flex-1 mt-2">
        {
          ordens.map((os) => (
            <CaixaOs
              cliente={os.cliente.nmCompleto}
              data={new Date(os.dtEntrada).toLocaleDateString("pt-BR")}
              modelo={os.aparelho.modelo}
              numeroOs={String(os.numOs)}
              status={os.status}
              key={os.numOs} />

          ))
        }
      </div>

    </div>
  );
}

export default OrdemServico