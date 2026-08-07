import {
  buscarClientePorCpf,
  type criarClienteDto,
} from "@/services/customerService";

import { Search } from "lucide-react";
import { useState } from "react";

interface BuscarClienteProps {
  onBuscar: (cliente: criarClienteDto) => void;
}

function BuscaCliente({ onBuscar }: BuscarClienteProps) {
  const [cpfBusca, setCpfBusca] = useState("");
  const [buscando, setBuscando] = useState(false);

  async function buscarCliente() {
    if (!cpfBusca.trim()) return;

    try {
      setBuscando(true);

      const dados = await buscarClientePorCpf(cpfBusca);

      onBuscar(dados);
    } catch {
      alert("Cliente não encontrado");
    } finally {
      setBuscando(false);
    }
  }

  return (
    <div
      className=" flex w-full  items-center gap-3 rounded-xl  border border-border   bg-card px-4 py-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
      <Search
        size={20}
        className="shrink-0 text-muted-foreground"
      />

      <input
        value={cpfBusca}
        onChange={(e) => setCpfBusca(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            buscarCliente();
          }
        }}
        type="text"
        placeholder="Digite o CPF do cliente"
        className=" flex-1 bg-transparent text-sm text-foreground  placeholder:text-muted-foreground outline-none"/>

      <button
        onClick={buscarCliente}
        disabled={buscando}
        className=" rounded-lg bg-primary  px-4 py-2 text-sm font-semibold  text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
        {buscando ? "Buscando..." : "Buscar"}
      </button>
    </div>
  );
}

export default BuscaCliente;