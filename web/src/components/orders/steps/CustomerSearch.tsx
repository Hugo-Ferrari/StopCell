import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { buscarClientePorCpf, type criarClienteDto } from "@/services/customerService";

interface CustomerSearchProps {
  mostrarToast: (msg: string, tipo: "sucesso" | "erro") => void;
  clienteSelecionado: criarClienteDto;
  setClienteSelecionado: (cliente: criarClienteDto) => void;
}

export default function CustomerSearch({ mostrarToast, clienteSelecionado, setClienteSelecionado }: CustomerSearchProps) {
  const [cpfBusca, setCpfBusca] = useState("");
  const [buscandoCliente, setBuscandoCliente] = useState(false);

  async function handleBuscarCliente() {
    const cpfLimpo = cpfBusca.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) return mostrarToast("O CPF deve conter 11 dígitos.", "erro");

    try {
      setBuscandoCliente(true);
      const dados = await buscarClientePorCpf(cpfLimpo);
      if (dados) {
        setClienteSelecionado(dados);
        mostrarToast("Cliente encontrado!", "sucesso");
      } else {
        mostrarToast("Cliente não encontrado.", "erro");
      }
    } catch {
      mostrarToast("Erro ou cliente não existe.", "erro");
    } finally {
      setBuscandoCliente(false);
    }
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-5 md:p-8">
      <h2 className="text-foreground font-bold mb-4">1. Buscar Cliente</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex flex-1 items-center bg-background border border-border rounded-xl px-4 py-1 focus-within:border-primary transition-colors">
          <Search size={20} className="text-muted-foreground mr-2" />
          <input
            type="text"
            placeholder="Digite apenas os números do CPF"
            value={cpfBusca}
            onChange={(e) => setCpfBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBuscarCliente()}
            className="w-full bg-transparent p-2 text-foreground outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleBuscarCliente}
          disabled={buscandoCliente}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-bold transition-colors flex justify-center items-center"
        >
          {buscandoCliente ? <Loader2 className="animate-spin" size={20} /> : "Buscar"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs md:text-sm font-bold text-foreground">Nome</label>
          <input type="text" readOnly value={clienteSelecionado.nmCompleto} className="w-full bg-background border border-border rounded-xl p-3.5 text-muted-foreground outline-none cursor-not-allowed" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs md:text-sm font-bold text-foreground">CPF</label>
          <input type="text" readOnly value={clienteSelecionado.cpf} className="w-full bg-background border border-border rounded-xl p-3.5 text-muted-foreground outline-none cursor-not-allowed" />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-xs md:text-sm font-bold text-foreground">Endereço Atual</label>
          <input type="text" readOnly value={clienteSelecionado.endereco} className="w-full bg-background border border-border rounded-xl p-3.5 text-muted-foreground outline-none cursor-not-allowed" />
        </div>
      </div>
    </div>
  );
}