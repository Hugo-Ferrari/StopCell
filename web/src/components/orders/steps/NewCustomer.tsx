import { criandoCliente, type criarClienteDto } from "@/services/customerService";
import { useState } from "react";
import { Link } from "react-router-dom";

function NovoCliente() {
  const [nmCompleto, setNmCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!nmCompleto.trim() ||!cpf.trim() ||!telefone.trim() ||!email.trim() ||!endereco.trim()) {
      return alert("Preencha todos os campos");
    }

    try {
      const data: criarClienteDto = {
         nmCompleto,
        cpf,
        telefone,
        email,
        endereco,
        aparelhos: [],
      };

      await criandoCliente(data);

      alert("Cliente criado");

      setNmCompleto("");
      setTelefone("");
      setEndereco("");
      setEmail("");
      setCpf("");

    } catch (err) {
      console.log(err)
    }
  }


  return (
    <div
      className=" rounded-2xl border border-border bg-card p-5  sm:p-6">

      <form
        onSubmit={handleSubmit}
        className="space-y-6">

        <div
          className=" grid  grid-cols-1  gap-5  md:grid-cols-2">

         
          <div className="md:col-span-2">

            <label className="mb-2 block font-medium text-foreground">
              Cliente
            </label>

            <input
              value={nmCompleto}
              onChange={(e) => setNmCompleto(e.target.value)}
              type="text"
              placeholder="Digite o nome completo"
              className="input-style"
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
              className="input-style"
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
              className="input-style"
            />

          </div>


          
          <div>

            <label className="mb-2 block font-medium text-foreground">
              Email
            </label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="cliente@email.com"
              className="input-style"
            />

          </div>


          
          <div>

            <label className="mb-2 block font-medium text-foreground">
              Endereço
            </label>

            <input
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              type="text"
              placeholder="rua, número, bairro, cidade"
              className="input-style"
            />

          </div>


        </div>


        <div
          className=" flex flex-col gap-3 sm:flex-row ">

          <button
            type="submit"
            className=" flex-1 rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition hover:opacity-90" >
            Cadastrar cliente
          </button>


          <Link
            to="/ordemServico"
            className=" flex-1 rounded-lg border border-border bg-background py-3 text-center font-semibold text-muted-foreground transition-all hover:border-primary hover:bg-accent hover:text-primary" >
            Cancelar
          </Link>

        </div>

      </form>

    </div>
  );
}

export default NovoCliente;