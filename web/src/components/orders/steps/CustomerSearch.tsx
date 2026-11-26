import { useState, type FormEvent } from "react";
import { IdCard, Loader2, Search } from "lucide-react";
import FormInput from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import { buscarClientePorCpf, type criarClienteDto } from "@/services/customerService";
import { naoEncontrado } from "@/utils/apiError";
import { formatarCpf, formatarTelefone } from "@/utils/masks";

interface CustomerSearchProps {
  mostrarToast: (msg: string, tipo: "sucesso" | "erro") => void;
  clienteSelecionado: criarClienteDto;
  setClienteSelecionado: (cliente: criarClienteDto) => void;
}

export default function CustomerSearch({ mostrarToast, clienteSelecionado, setClienteSelecionado }: CustomerSearchProps) {
  const [cpfBusca, setCpfBusca] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | undefined>();

  // aqui não valida os dígitos do CPF: cliente antigo pode ter sido salvo com CPF errado
  // e precisa continuar sendo encontrado
  async function handleBuscar(e: FormEvent) {
    e.preventDefault();
    const cpfLimpo = cpfBusca.replace(/\D/g, "");

    if (cpfLimpo.length !== 11) {
      setErro("Digite os 11 números do CPF");
      return;
    }

    setErro(undefined);
    try {
      setBuscando(true);
      const dados = await buscarClientePorCpf(cpfLimpo);
      if (dados) {
        setClienteSelecionado(dados);
      } else {
        mostrarToast("Cliente não encontrado.", "erro");
      }
    } catch (error) {
      if (naoEncontrado(error)) {
        mostrarToast("Cliente não encontrado. Confira o CPF ou cadastre um novo.", "erro");
      } else {
        mostrarToast("Não foi possível buscar o cliente agora. Verifique a conexão e tente de novo.", "erro");
      }
    } finally {
      setBuscando(false);
    }
  }

  const cliente = clienteSelecionado?.cpf ? clienteSelecionado : null;

  const dados = cliente
    ? [
        { rotulo: "Nome", valor: cliente.nmCompleto },
        { rotulo: "CPF", valor: formatarCpf(cliente.cpf) },
        { rotulo: "WhatsApp", valor: cliente.telefone ? formatarTelefone(cliente.telefone) : "" },
        { rotulo: "E-mail", valor: cliente.email },
        { rotulo: "Endereço", valor: cliente.endereco, inteiro: true },
      ]
    : [];

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 md:p-6">
      <h2 className="font-semibold text-foreground">Buscar cliente</h2>

      <form onSubmit={handleBuscar} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <FormInput
            label="CPF do cliente"
            icon={<IdCard size={18} />}
            inputMode="numeric"
            placeholder="000.000.000-00"
            maxLength={14}
            value={cpfBusca}
            onChange={(e) => setCpfBusca(formatarCpf(e.target.value))}
            error={erro}
          />
        </div>
        <Button type="submit" disabled={buscando} className="h-[42px] rounded-xl px-6 sm:mt-7">
          {buscando ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          Buscar
        </Button>
      </form>

      {cliente && (
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-xl bg-muted/50 p-4 text-sm animate-in fade-in-0 sm:grid-cols-2">
          {dados.map((item) => (
            <div key={item.rotulo} className={item.inteiro ? "sm:col-span-2" : undefined}>
              <dt className="text-xs text-muted-foreground">{item.rotulo}</dt>
              <dd className="truncate font-medium tabular-nums">{item.valor || "Não informado"}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}