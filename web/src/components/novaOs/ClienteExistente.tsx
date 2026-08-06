
import type { AparelhoDto } from "@/services/aparelho.service";
import { type criarClienteDto } from "@/services/cliente.service";

import { useState } from "react";
import BuscaCliente from "./BuscaCliente";
import DadosCliente from "./DadosCliente";
import DadosAparelhos from "./DadosAparelhos";
import DadosOrdemServico from "./DadosOrdemServico";
function ClienteExistente() {




  const [cliente, setCliente] = useState<criarClienteDto | null>(null);
  const [aparelhoSelecionado, setAparelhoSelecionado] = useState<AparelhoDto | null>(null)


  return (
    <div className=" sm:p-6">
      <div className="space-y-4">
        {/** colocar icone aqui  */}
        <h2 className="text-lg sm:text-xl font-bold text-foreground ">
          Cliente
        </h2>
        <div className="bg-card  border border-border p-6">

          {/** criar campo no backend para filtar os clientes de acorco com o numero de telefone ou cpf */}

          <p className="mt-1 mb-4  text-muted-foreground">
            Selecione um cliente para criar a Ordem de Serviço.
          </p>
          <BuscaCliente onBuscar={setCliente} />

        </div>
      </div>

      <div className="  ">


        <div className="space-y-4">

          <DadosCliente cliente={cliente} />


          <h2 className="text-lg sm:text-xl  font-bold text-foreground mt-5 ">
            {/** icone de aparelho */}
            Aparelho
          </h2>
          <h2>Selecione ou crie um aparelho </h2>
          <div className="">

            <select
              className="bg-card p-3"
              onChange={(e) => {
                const aparelho = cliente?.aparelhos?.find(
                  (aparelho) => aparelho.imei === (e.target.value)
                );

                setAparelhoSelecionado(aparelho ?? null);
              }}
            >
              <option key="vazio" value="">
                Selecione um aparelho
              </option>

              {cliente?.aparelhos?.map((aparelho) => (
                <option key={aparelho.imei} value={aparelho.imei}>
                  {aparelho.modelo}
                </option>
              ))}
            </select>


            <button className="px-5">
              criar novo aparelho
            </button>
          </div>

          <DadosAparelhos aparelho={aparelhoSelecionado} />



          <h2 className="text-lg sm:text-xl  font-bold text-foreground mt-5 ">
            {/** icone de aparelho */}
            Ordem de Serviço
          </h2>
          <DadosOrdemServico />
        </div>
        /</div>
    </div>

  );
}

export default ClienteExistente;