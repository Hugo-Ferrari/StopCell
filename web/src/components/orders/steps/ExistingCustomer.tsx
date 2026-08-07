import type { AparelhoDto } from "@/services/deviceService";
import { type criarClienteDto } from "@/services/customerService";

import { useState } from "react";
import BuscaCliente from "./CustomerSearch";
import DadosCliente from "./CustomerDetails";
import DadosAparelhos from "./DamagedDevices";
import DadosOrdemServico from "./ServiceOrderData";

function ClienteExistente() {

  const [cliente, setCliente] = useState<criarClienteDto | null>(null);

  const [aparelhoSelecionado, setAparelhoSelecionado] =
    useState<AparelhoDto | null>(null);


  function selecionarAparelho(
    imei: string
  ) {

    const aparelho = cliente?.aparelhos?.find(
      (aparelho) => aparelho.imei === imei
    );

    setAparelhoSelecionado(aparelho ?? null);
  }


  return (
    <div
      className=" space-y-6 p-4 sm:p-6">

  
      <section
        className=" rounded-2xl border border-border bg-card p-5 shadow-sm">

        <h2
          className="  mb-1 text-xl  font-bold text-foreground  ">
          Cliente
        </h2>


        <p
          className="  mb-5  text-sm  text-muted-foreground  ">
          Selecione um cliente para criar a Ordem de Serviço.
        </p>


        <BuscaCliente
          onBuscar={setCliente}
        />


        <div className="mt-6">
          <DadosCliente cliente={cliente}/>
        </div>

      </section>



     
      <section
        className=" rounded-2xl border border-border bg-card p-5 shadow-sm ">

        <h2
          className=" mb-1 text-xl  font-bold  text-foreground ">
          Aparelho
        </h2>


        <p
          className=" mb-5 text-sm  text-muted-foreground ">
          Selecione um aparelho existente ou cadastre um novo.
        </p>


        <div
          className=" flex flex-col  gap-3  sm:flex-row">

          <select
            className=" flex-1 rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 "
            onChange={(e) =>
              selecionarAparelho(e.target.value)
            }
          >

            <option value="">
              Selecione um aparelho
            </option>


            {cliente?.aparelhos?.map((aparelho) => (

              <option
                key={aparelho.imei}
                value={aparelho.imei}
              >
                {aparelho.modelo}
              </option>

            ))}

          </select>


          <button
            className=" rounded-l bg-primary px-5 py-3 font-semibold text-primary-foreground  transition hover:opacity-90">
            Novo aparelho
          </button>

        </div>


        <div className="mt-6">
          <DadosAparelhos
            aparelho={aparelhoSelecionado}
          />
        </div>

      </section>



      
      <section
        className=" rounded-2xl border border-border bg-card p-5  shadow-sm">

        <h2
          className=" mb-5 text-xl font-boldtext-foreground">
          Ordem de Serviço
        </h2>


        <DadosOrdemServico />

      </section>

    </div>
  );
}

export default ClienteExistente;