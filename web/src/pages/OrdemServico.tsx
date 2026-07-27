import CaixaOs from '@/components/OS/caixaOs'
import CaixaStatusOs from '@/components/OS/CaixaStatusOs'

import React from 'react'

function OrdemServico() {
    return (
        <div className=" flex-col ">

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-auto h-auto">
                <CaixaStatusOs status="DIAGNOSTICO" quantidade={7} />
                <CaixaStatusOs status="AGUARDANDO_PECA" quantidade={4} />
                <CaixaStatusOs status="EM_REPARO" quantidade={3} />
                <CaixaStatusOs status="FINALIZADO" quantidade={1} />
            </div>

            <div className="flex-1">
                <CaixaOs />
            </div>

        </div>
    );
}

export default OrdemServico