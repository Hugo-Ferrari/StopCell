
import type { AparelhoDto } from "@/services/aparelho.service";
import { buscarClientePorCpf, type criarClienteDto } from "@/services/cliente.service";
import { Search } from "lucide-react";
import { useState } from "react";
function ClienteExistente() {
  const [cpfBusca, setCpfBusca] = useState("");

  const [cliente, setCliente] = useState<criarClienteDto | null>(null);


  const [aparelhoSelecionado, setAparelhoSelecionado] = useState<AparelhoDto | null>(null)
  async function buscarCliente() {
    try {
      const dados = await buscarClientePorCpf(cpfBusca)
      console.log(dados)
      setCliente(dados)
    }
    catch {
      alert(`cliente nao encontrado`)
    }

  }

  return (
    <div className=" sm:p-6">
      <div className="space-y-4">
        {/** colocar icone aqui  */}
        <h2 className="text-lg sm:text-xl font-bold text-foreground border-b-1">
          Cliente
        </h2>
        <div className="bg-card  border border-border p-6">

          {/** criar campo no backend para filtar os clientes de acorco com o numero de telefone ou cpf */}

          <p className="mt-1 mb-4  text-muted-foreground">
            Selecione um cliente para criar a Ordem de Serviço.
          </p>

          <div className="flex items-center rounded-lg border border-border bg-background  px-3 py-3 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary">
            <Search
              size={18}
              className="text-muted-foreground"
            />

            <input
              value={cpfBusca}
              onChange={(e) => setCpfBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  buscarCliente()
                }
              }}
              type="text"
              placeholder="CPF"
              className="ml-3 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </div>

        <div className="  ">


          <div className="space-y-4">

            <div>
              <label className="mb-2 block   text-foreground">
                Nome do Cliente
              </label>

              <input
                value={cliente?.nmCompleto ?? ""}
                type="text"
                placeholder="Selecione um cliente"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block   text-foreground">
                CPF
              </label>

              <input
                value={cliente?.cpf ?? ""}
                type="text"
                placeholder="000.000.000-00"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block   text-foreground">
                WhatsApp
              </label>

              <input
                value={cliente?.telefone ?? ""}
                type="text"
                placeholder="(00)00000-0000"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block   text-foreground">
                Email
              </label>

              <input
                value={cliente?.email ?? ""}
                type="text"
                placeholder="cliente@email.com"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block   text-foreground">
                Endereço
              </label>

              <input
                value={cliente?.endereco ?? ""}
                type="text"
                placeholder="rua, numero, bairro, cidade"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>


            <h2 className="text-lg sm:text-xl  font-bold text-foreground mt-5 border-b-1">
              {/** icone de aparelho */}
              Aparelho
            </h2>
            <h2>Selecione ou crie um aparelho </h2>
            <div className="">

              <select
                className="bg-card p-3"
                onChange={(e) => {
                  const aparelho = cliente?.aparelhos?.find(
                    (aparelho) => aparelho.id === Number(e.target.value)
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
            <div>
              <label className="mb-2 block   text-foreground">
                Categoria
              </label>
              {/**fazer sistema para escolher a categoria como, smartfone,tablet entre outros */}
              <input
                value={aparelhoSelecionado?.categoria ?? ""}
                type="text"
                placeholder="Selecione"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block   text-foreground">
                Marca
              </label>
              <input
                value={aparelhoSelecionado?.marca.nome ?? ""}
                type="text"
                placeholder="Selecione"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block   text-foreground">
                Modelo do Aparelho
              </label>

              <input
                value={aparelhoSelecionado?.modelo ?? ""}
                type="text"
                placeholder="Ex.: iPhone 13"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block   text-foreground">
                IMEI / Nº de Série

              </label>

              <input
                value={aparelhoSelecionado?.imei ?? ""}
                type="text"
                placeholder="0000000000000"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block   text-foreground">
                Cor

              </label>

              <input
                value={aparelhoSelecionado?.cor ?? ""}
                type="text"
                placeholder="0000000000000"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block   text-foreground">
                Tipo de bloqueio

              </label>
              {/**se for "padrão", "senha" ou "pin" coloque o input para ter o campo para se digitar a senha, caso for " sem senha " ou ""biometria" não coloque nada*/}
              <input

                type="text"
                placeholder="Padrão "
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>




            <h2 className="text-lg sm:text-xl  font-bold text-foreground mt-5 border-b-1">
              {/** icone de aparelho */}
              Ordem de Serviço
            </h2>
            <div>
              <label className="">
                Técnico responsavel
              </label>
              <input placeholder="Quem Recebeu o aparelho" className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary">{/**Usuario dono da empresa */}</input>
            </div>
            <div>
              <label className="mb-2 block text-foreground ">
                Relato do Problema
              </label>

              <textarea
                rows={5}
                placeholder="Descreva o problema..."
                className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:opacity-90"
            >
              Gerar OS Digital
            </button>

            <button
              className="w-full rounded-lg border border-border bg-card py-3 font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Cancelar
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ClienteExistente;