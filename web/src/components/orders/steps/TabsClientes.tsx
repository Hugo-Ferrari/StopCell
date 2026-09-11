import { useState } from "react";
import { Search, User, UserPlus, Loader2 } from "lucide-react";
import { 
  criandoCliente, 
  buscarClientePorCpf, 
  type criarClienteDto 
} from "@/services/customerService";

function TabsClientes() {
  const [abaAtiva, setAbaAtiva] = useState<"existente" | "novo">("existente");

  // aba de cliente existente
  const [cpfBusca, setCpfBusca] = useState("");
  const [buscandoCliente, setBuscandoCliente] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<criarClienteDto>({
    nmCompleto: "",
    cpf: "",
    telefone: "",
    email: "",
    endereco: "",
    aparelhos: []
  });

  // aba de cadastrar novo cliente
  const [nomeNovo, setNomeNovo] = useState("");
  const [cpfNovo, setCpfNovo] = useState("");
  const [whatsAppNovo, setWhatsAppNovo] = useState("");
  const [emailNovo, setEmailNovo] = useState("");
  const [enderecoNovo, setEnderecoNovo] = useState("");
  const [carregando, setCarregando] = useState(false);

  // buscar cliente existente - cpf
  async function handleBuscarCliente() {
    if (!cpfBusca.trim()) {
      alert("Digite o CPF do cliente para buscar.");
      return;
    }

    try {
      setBuscandoCliente(true);
      const dados = await buscarClientePorCpf(cpfBusca.trim());
      
      if (dados) {
        setClienteSelecionado(dados);
      } else {
        alert("Cliente não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      alert("Cliente não encontrado ou erro na busca.");
    } finally {
      setBuscandoCliente(false);
    }
  }

  // cadastrar novo cliente
  async function handleCadastrarCliente(e: React.FormEvent) {
    e.preventDefault();

    if (!nomeNovo.trim() || !cpfNovo.trim() || !whatsAppNovo.trim() || !emailNovo.trim() || !enderecoNovo.trim()) {
      alert("Por favor, preencha TODOS os campos do formulário.");
      return;
    }

    try {
      setCarregando(true);

      // dados do novo cliente
      const dadosNovoCliente = {
        nmCompleto: nomeNovo,
        cpf: cpfNovo,
        telefone: whatsAppNovo,
        email: emailNovo,
        endereco: enderecoNovo,
      };

      const clienteCriado = await criandoCliente(dadosNovoCliente as any);

      alert("Cliente cadastrado com sucesso!");

      // preenche automaticamente os campos da aba de cliente existente com os dados do cliente recém-criado
      setClienteSelecionado({
        nmCompleto: clienteCriado?.nmCompleto || nomeNovo,
        cpf: clienteCriado?.cpf || cpfNovo,
        telefone: clienteCriado?.telefone || whatsAppNovo,
        email: clienteCriado?.email || emailNovo,
        endereco: clienteCriado?.endereco || enderecoNovo,
        aparelhos: clienteCriado?.aparelhos || []
      });

      // Limpa os campos do formulário
      setNomeNovo("");
      setCpfNovo("");
      setWhatsAppNovo("");
      setEmailNovo("");
      setEnderecoNovo("");

      // Alterna automaticamente para a aba de cliente existente
      setAbaAtiva("existente");
    } catch (error: any) {
      console.error("Erro completo ao cadastrar cliente:", error);
      
      const mensagemBackend = error.response?.data?.message;
      if (Array.isArray(mensagemBackend)) {
        alert(`Erro de validação: ${mensagemBackend.join(", ")}`);
      } else if (mensagemBackend) {
        alert(`Erro do servidor: ${mensagemBackend}`);
      } else {
        alert(`Erro de conexão (${error.response?.status || 'Servidor indisponível'}).`);
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6">
      
    
      <div className="flex flex-col mb-2">
        <span className="text-white text-xs font-bold uppercase tracking-widest">
          <span className="text-[#F25C38]">Stop</span> Cell
        </span>
        <h1 className="text-2xl md:text-3xl font-bold mt-1 text-white">Nova Ordem de Serviço</h1>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setAbaAtiva("existente")}
          className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-medium transition-all ${
            abaAtiva === "existente"
              ? "bg-[#F25C38] text-white"
              : "bg-[#141414] border border-[#222222] text-zinc-400 hover:text-white"
          }`}
        >
          <User size={20} /> Cliente Existente
        </button>
        <button
          type="button"
          onClick={() => setAbaAtiva("novo")}
          className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-medium transition-all ${
            abaAtiva === "novo"
              ? "bg-[#F25C38] text-white"
              : "bg-[#141414] border border-[#222222] text-zinc-400 hover:text-white"
          }`}
        >
          <UserPlus size={20} /> Cadastrar novo cliente
        </button>
      </div>

      { //aba cliente existente 
      }
      {abaAtiva === "existente" && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
          
          {/* Bloco dados do Cliente */}
          <div className="bg-[#141414] border border-[#222222] rounded-3xl p-6 md:p-8 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-white">Cliente</h2>
              <p className="text-sm text-zinc-400 mt-1">Selecione um cliente para criar a Ordem de Serviço.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-1 items-center rounded-2xl border border-[#222222] bg-[#0A0A0A] px-4 py-1 focus-within:border-[#F25C38] transition-colors">
                <Search size={20} className="text-zinc-500 mr-2" />
                <input
                  type="text"
                  placeholder="Digite o CPF do cliente"
                  value={cpfBusca}
                  onChange={(e) => setCpfBusca(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleBuscarCliente()}
                  className="w-full bg-transparent p-2 text-white placeholder:text-zinc-500 outline-none"
                />
              </div>
              <button 
                type="button"
                onClick={handleBuscarCliente}
                disabled={buscandoCliente}
                className="bg-[#F25C38] hover:bg-[#e04f2d] text-white px-8 py-3 rounded-2xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {buscandoCliente ? <Loader2 className="animate-spin" size={20} /> : "Buscar"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">Nome do Cliente</label>
                <input type="text" readOnly value={clienteSelecionado.nmCompleto} placeholder="Selecione um cliente" className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-3 text-zinc-300 outline-none cursor-not-allowed" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">CPF</label>
                <input type="text" readOnly value={clienteSelecionado.cpf} placeholder="000.000.000-00" className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-3 text-zinc-300 outline-none cursor-not-allowed" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">WhatsApp</label>
                <input type="text" readOnly value={clienteSelecionado.telefone} placeholder="(00)00000-0000" className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-3 text-zinc-300 outline-none cursor-not-allowed" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">Email</label>
                <input type="text" readOnly value={clienteSelecionado.email} placeholder="cliente@email.com" className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-3 text-zinc-300 outline-none cursor-not-allowed" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-white">Endereço</label>
                <input type="text" readOnly value={clienteSelecionado.endereco} placeholder="rua, numero, bairro, cidade" className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-3 text-zinc-300 outline-none cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Bloco dados do Aparelho */}
          <div className="bg-[#141414] border border-[#222222] rounded-3xl p-6 md:p-8 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-white">Aparelho</h2>
              <p className="text-sm text-zinc-400 mt-1">Selecione um aparelho existente ou cadastre um novo.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <select className="flex-1 bg-[#0A0A0A] border border-[#222222] rounded-2xl p-4 text-white outline-none appearance-none cursor-pointer">
                <option value="">Selecione um aparelho</option>
                {clienteSelecionado.aparelhos?.map((aparelho) => (
                  <option key={aparelho.imei} value={aparelho.imei}>
                    {aparelho.modelo}
                  </option>
                ))}
              </select>
              <button type="button" className="bg-[#F25C38] hover:bg-[#e04f2d] text-white px-8 py-4 rounded-2xl font-bold transition-colors">
                Novo aparelho
              </button>
            </div>
          </div>

          {/* Bloco Ordem de Serviço */}
          <div className="bg-[#141414] border border-[#222222] rounded-3xl p-6 md:p-8 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-white">Ordem de Serviço</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">Técnico responsável</label>
              <input type="text" placeholder="Quem recebeu o aparelho" className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 text-white outline-none focus:border-[#F25C38]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">Relato do problema</label>
              <textarea rows={4} placeholder="Descreva o problema..." className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 text-white outline-none focus:border-[#F25C38] resize-none"></textarea>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <button type="button" className="bg-[#F25C38] hover:bg-[#e04f2d] text-white py-4 rounded-2xl font-bold transition-colors">
                Gerar OS Digital
              </button>
              <button type="button" className="bg-[#0A0A0A] border border-[#222222] text-zinc-300 hover:text-white py-4 rounded-2xl font-bold transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/*aba cadastrar novo cliente*/}
      {abaAtiva === "novo" && (
        <form onSubmit={handleCadastrarCliente} className="bg-[#141414] border border-[#222222] rounded-3xl p-6 md:p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">Cliente *</label>
            <input 
              type="text" 
              required
              placeholder="Digite o nome completo" 
              value={nomeNovo}
              onChange={(e) => setNomeNovo(e.target.value)}
              className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 text-white outline-none focus:border-[#F25C38] transition-colors" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">CPF *</label>
              <input 
                type="text" 
                required
                placeholder="000.000.000-00" 
                value={cpfNovo}
                onChange={(e) => setCpfNovo(e.target.value)}
                className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 text-white outline-none focus:border-[#F25C38] transition-colors" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">WhatsApp *</label>
              <input 
                type="text" 
                required
                placeholder="(00) 00000-0000" 
                value={whatsAppNovo}
                onChange={(e) => setWhatsAppNovo(e.target.value)}
                className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 text-white outline-none focus:border-[#F25C38] transition-colors" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">Email *</label>
              <input 
                type="email" 
                required
                placeholder="cliente@email.com" 
                value={emailNovo}
                onChange={(e) => setEmailNovo(e.target.value)}
                className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 text-white outline-none focus:border-[#F25C38] transition-colors" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">Endereço *</label>
              <input 
                type="text" 
                required
                placeholder="rua, número, bairro, cidade" 
                value={enderecoNovo}
                onChange={(e) => setEnderecoNovo(e.target.value)}
                className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 text-white outline-none focus:border-[#F25C38] transition-colors" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <button 
              type="submit"
              disabled={carregando}
              className="flex items-center justify-center gap-2 bg-[#F25C38] hover:bg-[#e04f2d] text-white py-4 rounded-2xl font-bold transition-colors disabled:opacity-50"
            >
              {carregando ? <Loader2 className="animate-spin" size={20} /> : "Cadastrar cliente"}
            </button>
            <button 
              type="button"
              onClick={() => setAbaAtiva("existente")}
              className="bg-[#0A0A0A] border border-[#222222] text-zinc-300 hover:text-white hover:bg-[#222222] py-4 rounded-2xl font-bold transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

    </div>
  );
}

export default TabsClientes;