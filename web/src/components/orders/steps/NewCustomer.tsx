import { useState } from "react";
import { Loader2 } from "lucide-react";
import FormInput from "@/components/common/FormInput";
import { useViaCep } from "@/hooks/useViaCep";
import { formatarCep, formatarCpf, formatarTelefone } from "@/utils/masks";
import { mensagemDeErro } from "@/utils/apiError";
import { criandoCliente, type criarClienteDto } from "@/services/customerService";

interface NewCustomerProps {
  mostrarToast: (msg: string, tipo: "sucesso" | "erro") => void;
  setAbaAtiva: (aba: "existente" | "novo") => void;
  setClienteSelecionado: (cliente: criarClienteDto) => void;
}

export default function NewCustomer({ mostrarToast, setAbaAtiva, setClienteSelecionado }: NewCustomerProps) {
  const [nomeNovo, setNomeNovo] = useState("");
  const [cpfNovo, setCpfNovo] = useState("");
  const [whatsAppNovo, setWhatsAppNovo] = useState("");
  const [emailNovo, setEmailNovo] = useState("");
  const [cepNovo, setCepNovo] = useState("");
  const [enderecoNovo, setEnderecoNovo] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { buscarCep, carregandoCep } = useViaCep();

  async function handleBuscarCep(cepDigitado: string) {
    const cepLimpo = cepDigitado.replace(/\D/g, "").slice(0, 8);
    setCepNovo(cepLimpo);

    if (cepLimpo.length === 8) {
      const endereco = await buscarCep(cepLimpo);
      if (endereco?.enderecoFormatado) {
        setEnderecoNovo(endereco.enderecoFormatado);
        mostrarToast("Endereço encontrado!", "sucesso");
      } else {
        mostrarToast("CEP não encontrado.", "erro");
      }
    }
  }

  async function handleCadastrarCliente(e: React.FormEvent) {
    e.preventDefault();
    const cpfLimpo = cpfNovo.replace(/\D/g, "");
    const whatsLimpo = whatsAppNovo.replace(/\D/g, "");

    if (!nomeNovo.trim() || cpfLimpo.length !== 11 || !whatsLimpo || !emailNovo.trim() || !enderecoNovo) {
      return mostrarToast("Preencha todos os campos corretamente (incluindo o e-mail).", "erro");
    }

    try {
      setCarregando(true);
      const criado = await criandoCliente({
        nmCompleto: nomeNovo.trim(),
        cpf: cpfLimpo,
        telefone: whatsLimpo,
        email: emailNovo.trim(),
        endereco: enderecoNovo.trim(),
      });

      setClienteSelecionado({ ...criado, aparelhos: [] });
      mostrarToast("Cliente cadastrado com sucesso!", "sucesso");

      setNomeNovo(""); setCpfNovo(""); setWhatsAppNovo(""); setEmailNovo(""); setCepNovo(""); setEnderecoNovo("");
      setAbaAtiva("existente");
    } catch (error) {
      mostrarToast(mensagemDeErro(error, "Erro ao cadastrar. Verifique o CPF.").split("\n")[0], "erro");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={handleCadastrarCliente} className="bg-card border border-border rounded-3xl p-5 md:p-8 flex flex-col gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-2">
      <h2 className="text-foreground font-bold mb-2">Dados do Novo Cliente</h2>

      <FormInput
        label="Nome Completo *"
        id="nomeNovo"
        value={nomeNovo}
        onChange={(e) => setNomeNovo(e.target.value)}
        placeholder="Digite o nome"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <FormInput
          label="CPF *"
          id="cpfNovo"
          inputMode="numeric"
          value={formatarCpf(cpfNovo)}
          onChange={(e) => setCpfNovo(e.target.value)}
          placeholder="000.000.000-00"
        />

        <FormInput
          label="WhatsApp *"
          id="whatsAppNovo"
          inputMode="tel"
          value={formatarTelefone(whatsAppNovo)}
          onChange={(e) => setWhatsAppNovo(e.target.value)}
          placeholder="(00) 00000-0000"
        />

        <FormInput
          label="E-mail *"
          id="emailNovo"
          type="email"
          value={emailNovo}
          onChange={(e) => setEmailNovo(e.target.value)}
          placeholder="cliente@email.com"
        />

        <FormInput
          label="CEP"
          id="cepNovo"
          inputMode="numeric"
          value={formatarCep(cepNovo)}
          onChange={(e) => handleBuscarCep(e.target.value)}
          placeholder="00000-000"
          rightElement={
            carregandoCep ? (
              <span className="text-xs text-primary flex items-center gap-1 font-medium">
                <Loader2 size={14} className="animate-spin" /> Buscando...
              </span>
            ) : null
          }
        />

        <div className="md:col-span-2">
          <FormInput
            label="Endereço Completo *"
            id="enderecoNovo"
            value={enderecoNovo}
            onChange={(e) => setEnderecoNovo(e.target.value)}
            placeholder="Rua, Número, Bairro"
          />
        </div>
      </div>

      <button type="submit" disabled={carregando} className="w-full md:w-auto mt-4 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-2xl font-bold transition-colors disabled:opacity-50">
        {carregando ? <Loader2 className="animate-spin" size={20} /> : "Cadastrar Cliente"}
      </button>
    </form>
  );
}
