import React from 'react'
import CaixaOs from '../OS/caixaOs'

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

interface BoxOsProps {
  ordens: OrdemServicoInterface[];
}
function BoxOs({ordens}: BoxOsProps) {
  return (
    <div className='bg-card'>
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
  )
}

export default BoxOs