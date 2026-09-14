import { useState } from "react";
import { Loader2 } from "lucide-react";
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
  const [emailNovo, setEmailNovo] = useState(""); // Estado do email já existia
  const [cepNovo, setCepNovo] = useState("");
  const [enderecoNovo, setEnderecoNovo] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleBuscarCep(cepDigitado: string) {
    const cepLimpo = cepDigitado.replace(/\D/g, "");
    setCepNovo(cepLimpo);

    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setEnderecoNovo(`${data.logradouro}, Nº  - ${data.bairro}, ${data.localidade} - ${data.uf}`);
          mostrarToast("Endereço encontrado!", "sucesso");
        } else {
          mostrarToast("CEP não encontrado.", "erro");
        }
      } catch {
        mostrarToast("Erro ao buscar CEP.", "erro");
      }
    }
  }

  async function handleCadastrarCliente(e: React.FormEvent) {
    e.preventDefault();
    const cpfLimpo = cpfNovo.replace(/\D/g, "");
    const whatsLimpo = whatsAppNovo.replace(/\D/g, "");

    // Adicionei validação de e-mail obrigatório
    if (!nomeNovo.trim() || cpfLimpo.length !== 11 || !whatsLimpo || !emailNovo.trim() || !enderecoNovo) {
      return mostrarToast("Preencha todos os campos corretamente (incluindo o e-mail).", "erro");
    }

    try {
      setCarregando(true);
      const dadosNovo = {
        nmCompleto: nomeNovo.trim(),
        cpf: cpfLimpo,
        telefone: whatsLimpo,
        email: emailNovo.trim(), // O E-mail está sendo mandado agora
        endereco: enderecoNovo.trim(),
      };

      const criado = await criandoCliente(dadosNovo as any);
      
      setClienteSelecionado({ ...criado, aparelhos: [] });
      mostrarToast("Cliente cadastrado com sucesso!", "sucesso");
      
      setNomeNovo(""); setCpfNovo(""); setWhatsAppNovo(""); setEmailNovo(""); setCepNovo(""); setEnderecoNovo("");
      setAbaAtiva("existente");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao cadastrar. Verifique o CPF.";
      mostrarToast(Array.isArray(msg) ? msg[0] : msg, "erro");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={handleCadastrarCliente} className="bg-[#141414] border border-[#222222] rounded-3xl p-5 md:p-8 flex flex-col gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-2">
      <h2 className="text-white font-bold mb-2">Dados do Novo Cliente</h2>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs md:text-sm font-bold text-white">Nome Completo *</label>
        <input type="text" value={nomeNovo} onChange={(e) => setNomeNovo(e.target.value)} placeholder="Digite o nome" className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-3.5 text-white outline-none focus:border-[#F25C38]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs md:text-sm font-bold text-white">CPF *</label>
          <input type="text" value={cpfNovo} onChange={(e) => setCpfNovo(e.target.value)} placeholder="000.000.000-00" className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-3.5 text-white outline-none focus:border-[#F25C38]" />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs md:text-sm font-bold text-white">WhatsApp *</label>
          <input type="text" value={whatsAppNovo} onChange={(e) => setWhatsAppNovo(e.target.value)} placeholder="(00) 00000-0000" className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-3.5 text-white outline-none focus:border-[#F25C38]" />
        </div>

        {/* CAMPO DE E-MAIL ADICIONADO AQUI */}
        <div className="flex flex-col gap-2">
          <label className="text-xs md:text-sm font-bold text-white">E-mail *</label>
          <input type="email" value={emailNovo} onChange={(e) => setEmailNovo(e.target.value)} placeholder="cliente@email.com" className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-3.5 text-white outline-none focus:border-[#F25C38]" />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs md:text-sm font-bold text-white">CEP</label>
          <input type="text" maxLength={9} value={cepNovo} onChange={(e) => handleBuscarCep(e.target.value)} placeholder="00000-000" className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-3.5 text-white outline-none focus:border-[#F25C38]" />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-xs md:text-sm font-bold text-white">Endereço Completo *</label>
          <input type="text" value={enderecoNovo} onChange={(e) => setEnderecoNovo(e.target.value)} placeholder="Rua, Número, Bairro" className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-3.5 text-white outline-none focus:border-[#F25C38]" />
        </div>
      </div>

      <button type="submit" disabled={carregando} className="w-full md:w-auto mt-4 flex items-center justify-center gap-2 bg-[#F25C38] hover:bg-[#e04f2d] text-white px-10 py-4 rounded-2xl font-bold transition-colors disabled:opacity-50">
        {carregando ? <Loader2 className="animate-spin" size={20} /> : "Cadastrar Cliente"}
      </button>
    </form>
  );
}