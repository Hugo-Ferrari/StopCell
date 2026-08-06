import { criandoCliente, type criarClienteDto } from "@/services/cliente.service";
import { useState } from "react";
import { Link } from "react-router-dom";

function NovoCliente() {
  const [nmCompleto, setNmCompleto] = useState("")
  const [cpf, setCpf] = useState("")
  const [telefone, setTelefone] = useState("")
  const [email, setEmail] = useState("")
  const [endereco, setEndereco] = useState("")


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (nmCompleto.trim() === "" || cpf.trim() === "" || telefone.trim() === "" || email.trim() === "" || endereco.trim() === "") {
      return alert("preencha todos os campos")
    }
    try {
      const data: criarClienteDto = {
        nmCompleto,
        cpf,
        telefone,
        email,
        endereco,
        aparelhos: []
      }
      await criandoCliente(data)
      alert(`Cliente criado`)

      setNmCompleto("")
      setTelefone("")
      setEndereco("")
      setEmail("")
      setCpf("")
    }
    catch (err) {
      console.log(err)
    }

  }


  return (
    <div className=" border border-border bg-card p-4 sm:p-6">
      <form className="space-y-4"
        onSubmit={handleSubmit}>

        <div>
          <label className="mb-2 block font-medium text-foreground">
            Cliente
          </label>

          <input
            value={nmCompleto}
            onChange={(e) => setNmCompleto(e.target.value)}
            type="text"
            placeholder="Digite o nome completo"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-foreground">
            CPF
          </label>

          <input
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            type="text"
            placeholder="000.000.000-00"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-foreground">
            WhatsApp
          </label>

          <input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            type="tel"
            placeholder="(00) 00000-0000"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <div>
            <label className="mb-2 block font-medium text-foreground">
              Email
            </label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="cliente@email.com"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mt-4 mb-2 block font-medium text-foreground">
              Endereço
            </label>

            <input
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              type="text"
              placeholder="rua, numero, bairro, cidade"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
            />

          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:opacity-90"
        >
          Cadastrar cliente
        </button>
        <Link
          to="/ordemServico"
          className="mt-3 flex w-full items-center justify-center rounded-lg border border-border bg-card px-4 py-3 font-semibold text-muted-foreground transition-all duration-200 hover:border-primary hover:bg-accent hover:text-primary"
        >
          Cancelar
        </Link>
      </form>
    </div>
  );
}

export default NovoCliente;