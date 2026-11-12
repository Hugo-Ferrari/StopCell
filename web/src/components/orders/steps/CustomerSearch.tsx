import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { buscarClientePorCpf, type criarClienteDto } from "@/services/customerService";
import { cn } from "@/lib/utils";
import FormInput from "@/components/common/FormInput";
import { formatarCpf } from "@/utils/masks";

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
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div className="flex-1">
          <FormInput
            label="CPF do cliente"
            id="cpfBusca"
            icon={<Search size={18} />}
            inputMode="numeric"
            placeholder="000.000.000-00"
            value={formatarCpf(cpfBusca)}
            onChange={(e) => setCpfBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBuscarCliente()}
          />
        </div>
        <button
          type="button"
          onClick={handleBuscarCliente}
          disabled={buscandoCliente}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2.5 rounded-xl font-bold transition-colors flex justify-center items-center cursor-pointer disabled:cursor-wait"
        >
          {buscandoCliente ? <Loader2 className="animate-spin" size={20} /> : "Buscar"}
        </button>
      </div>

      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 transition-opacity", !clienteSelecionado?.cpf && "opacity-50")}>
        <FormInput
          label="Nome"
          id="clienteNome"
          readOnly
          value={clienteSelecionado.nmCompleto ?? ""}
          placeholder="Preenchido após a busca"
          className="cursor-not-allowed"
        />
        <FormInput
          label="CPF"
          id="clienteCpf"
          readOnly
          value={formatarCpf(clienteSelecionado.cpf ?? "")}
          placeholder="Preenchido após a busca"
          className="cursor-not-allowed"
        />
        <div className="md:col-span-2">
          <FormInput
            label="Endereço Atual"
            id="clienteEndereco"
            readOnly
            value={clienteSelecionado.endereco ?? ""}
            placeholder="Preenchido após a busca"
            className="cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}