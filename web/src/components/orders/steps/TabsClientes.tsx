import { useState } from "react";
import { Search, User, UserPlus, Loader2, Smartphone, CheckCircle2, XCircle } from "lucide-react";
import { criandoCliente, buscarClientePorCpf, type criarClienteDto } from "@/services/customerService";

// Listas fixas para evitar duplicidade no banco
const CATEGORIAS = ["Smartphone", "Tablet", "Notebook", "Smartwatch", "Outro"];
const MARCAS = ["Apple", "Samsung", "Xiaomi", "Motorola", "LG", "Asus", "Realme", "Outra"];
const TIPOS_SENHA = ["Numérica (PIN)", "Alfanumérica", "Padrão (Desenho)", "Sem Senha", "Não Informada"];

export default function TabsClientes() {
  const [abaAtiva, setAbaAtiva] = useState<"existente" | "novo">("existente");

  // notificações
  const [toast, setToast] = useState<{ visivel: boolean; msg: string; tipo: "sucesso" | "erro" }>({ visivel: false, msg: "", tipo: "sucesso" });

  function mostrarToast(msg: string, tipo: "sucesso" | "erro") {
    setToast({ visivel: true, msg, tipo });
    setTimeout(() => setToast({ visivel: false, msg: "", tipo: "sucesso" }), 4000); // Some após 4s
  }

  // aba 1: cliente existente
  const [cpfBusca, setCpfBusca] = useState("");
  const [buscandoCliente, setBuscandoCliente] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<criarClienteDto>({
    nmCompleto: "", cpf: "", telefone: "", email: "", endereco: "", aparelhos: []
  });
  
  // -- estado do aparelho
  const [imei, setImei] = useState("");
  const [categoriaOs, setCategoriaOs] = useState("");
  const [marcaOs, setMarcaOs] = useState("");
  const [modelo, setModelo] = useState("");
  const [cor, setCor] = useState("");
  const [tipoSenha, setTipoSenha] = useState("");
  const [senhaAparelho, setSenhaAparelho] = useState("");
  const [desenhando, setDesenhando] = useState(false);

  // aba 2: novo cliente
  const [nomeNovo, setNomeNovo] = useState("");
  const [cpfNovo, setCpfNovo] = useState("");
  const [whatsAppNovo, setWhatsAppNovo] = useState("");
  const [emailNovo, setEmailNovo] = useState("");
  const [cepNovo, setCepNovo] = useState("");
  const [enderecoNovo, setEnderecoNovo] = useState("");
  const [carregando, setCarregando] = useState(false);

  // buscar cep por api viacep
  async function handleBuscarCep(cepDigitado: string, setCepState: any, setEnderecoState: any) {
    const cepLimpo = cepDigitado.replace(/\D/g, "");
    setCepState(cepLimpo);

    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setEnderecoState(`${data.logradouro}, Nº  - ${data.bairro}, ${data.localidade} - ${data.uf}`);
          mostrarToast("Endereço encontrado!", "sucesso");
        } else {
          mostrarToast("CEP não encontrado.", "erro");
        }
      } catch {
        mostrarToast("Erro ao buscar CEP.", "erro");
      }
    }
  }

  // buscar cliente
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

  // cadastar cliente
  async function handleCadastrarCliente(e: React.FormEvent) {
    e.preventDefault();
    const cpfLimpo = cpfNovo.replace(/\D/g, "");
    const whatsLimpo = whatsAppNovo.replace(/\D/g, "");

    if (!nomeNovo.trim() || cpfLimpo.length !== 11 || !whatsLimpo || !enderecoNovo) {
      return mostrarToast("Preencha todos os campos corretamente.", "erro");
    }

    try {
      setCarregando(true);
      const dadosNovo = {
        nmCompleto: nomeNovo.trim(),
        cpf: cpfLimpo,
        telefone: whatsLimpo,
        email: emailNovo.trim(),
        endereco: enderecoNovo.trim(),
      };

      const criado = await criandoCliente(dadosNovo as any);
      
      setClienteSelecionado({ ...criado, aparelhos: [] });
      mostrarToast("Cliente cadastrado com sucesso!", "sucesso");
      
      // Limpa os campos e volta pra aba de existente
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
    <div className="w-full max-w-4xl flex flex-col gap-6 relative">
      
      {/* pop-up */}
      {toast.visivel && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all animate-in slide-in-from-top-5 ${toast.tipo === "sucesso" ? "bg-green-500/10 border border-green-500/50 text-green-500" : "bg-red-500/10 border border-red-500/50 text-red-500"}`}>
          {toast.tipo === "sucesso" ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
          <span className="font-bold text-sm">{toast.msg}</span>
        </div>
      )}

      {/* --- ABAS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button type="button" onClick={() => setAbaAtiva("existente")} className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-medium transition-all ${abaAtiva === "existente" ? "bg-[#F25C38] text-white" : "bg-[#141414] border border-[#222222] text-zinc-400 hover:text-white"}`}>
          <User size={20} /> Cliente Existente
        </button>
        <button type="button" onClick={() => setAbaAtiva("novo")} className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-medium transition-all ${abaAtiva === "novo" ? "bg-[#F25C38] text-white" : "bg-[#141414] border border-[#222222] text-zinc-400 hover:text-white"}`}>
          <UserPlus size={20} /> Cadastrar novo cliente
        </button>
      </div>

      {/* aba cliente existente */}
      {abaAtiva === "existente" && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
          
          <div className="bg-[#141414] border border-[#222222] rounded-3xl p-5 md:p-8">
            <h2 className="text-white font-bold mb-4">1. Buscar Cliente</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex flex-1 items-center bg-[#0A0A0A] border border-[#222222] rounded-xl px-4 py-1 focus-within:border-[#F25C38] transition-colors">
                <Search size={20} className="text-zinc-500 mr-2" />
                <input type="text" placeholder="Digite apenas os números do CPF" value={cpfBusca} onChange={(e) => setCpfBusca(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleBuscarCliente()} className="w-full bg-transparent p-2 text-white outline-none" />
              </div>
              <button type="button" onClick={handleBuscarCliente} disabled={buscandoCliente} className="bg-[#F25C38] hover:bg-[#e04f2d] text-white px-8 py-3 rounded-xl font-bold transition-colors flex justify-center items-center">
                {buscandoCliente ? <Loader2 className="animate-spin" size={20} /> : "Buscar"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs md:text-sm font-bold text-white">Nome</label>
                <input type="text" readOnly value={clienteSelecionado.nmCompleto} className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-3.5 text-zinc-400 outline-none cursor-not-allowed" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs md:text-sm font-bold text-white">CPF</label>
                <input type="text" readOnly value={clienteSelecionado.cpf} className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-3.5 text-zinc-400 outline-none cursor-not-allowed" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs md:text-sm font-bold text-white">Endereço Atual</label>
                <input type="text" readOnly value={clienteSelecionado.endereco} className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-3.5 text-zinc-400 outline-none cursor-not-allowed" />
              </div>
            </div>
          </div>

          <div className="bg-[#141414] border border-[#222222] rounded-3xl p-5 md:p-8">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Smartphone size={18}/> 2. Dados do Aparelho</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              
              {/* IMEI Obrigatório */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs md:text-sm font-bold text-white flex justify-between">
                  <span>IMEI / Nº de Série *</span>
                  <span className="text-zinc-500 font-normal">Identificador Único</span>
                </label>
                <input type="text" required value={imei} onChange={(e) => setImei(e.target.value)} placeholder="Digite o IMEI ou Nº de Série" className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 text-white outline-none focus:border-[#F25C38]" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs md:text-sm font-bold text-white">Categoria *</label>
                <select value={categoriaOs} onChange={(e) => setCategoriaOs(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl py-4 px-4 text-white outline-none focus:border-[#F25C38] appearance-none">
                  <option value="" disabled>Selecione...</option>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs md:text-sm font-bold text-white">Marca *</label>
                <select value={marcaOs} onChange={(e) => setMarcaOs(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl py-4 px-4 text-white outline-none focus:border-[#F25C38] appearance-none">
                  <option value="" disabled>Selecione...</option>
                  {MARCAS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs md:text-sm font-bold text-white">Modelo / Descrição</label>
                <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Ex: iPhone 13 Pro Max" className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 text-white outline-none focus:border-[#F25C38]" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs md:text-sm font-bold text-white">Cor</label>
                <input type="text" value={cor} onChange={(e) => setCor(e.target.value)} placeholder="Ex: Preto, Azul" className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 text-white outline-none focus:border-[#F25C38]" />
              </div>

              {/* tipo de senha */}
              <div className="flex flex-col gap-2 md:col-span-2 mt-2">
                <label className="text-xs md:text-sm font-bold text-white">Tipo de Senha</label>
                <select value={tipoSenha} onChange={(e) => { setTipoSenha(e.target.value); setSenhaAparelho(""); }} className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl py-4 px-4 text-white outline-none focus:border-[#F25C38] appearance-none">
                  <option value="" disabled>Selecione o tipo de bloqueio...</option>
                  {TIPOS_SENHA.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* senha de texto/pin */}
              {(tipoSenha === "Numérica (PIN)" || tipoSenha === "Alfanumérica") && (
                <div className="flex flex-col gap-2 md:col-span-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs md:text-sm font-bold text-[#F25C38]">Senha do Aparelho</label>
                  <input type={tipoSenha === "Numérica (PIN)" ? "number" : "text"} value={senhaAparelho} onChange={(e) => setSenhaAparelho(e.target.value)} placeholder="Digite a senha de desbloqueio" className="w-full bg-[#F25C38]/10 border border-[#F25C38]/30 rounded-xl p-4 text-white outline-none focus:border-[#F25C38]" />
                </div>
              )}

              {/* senha de desenho (swipe/arrastar ou digitar) */}
              {tipoSenha === "Padrão (Desenho)" && (
                <div className="flex flex-col md:flex-row gap-6 items-center bg-[#0A0A0A] border border-[#222222] p-5 rounded-2xl md:col-span-2 animate-in fade-in slide-in-from-top-2">
                  
                  {/* Grid visual 3x3 Interativo */}
                  <div 
                    className="grid grid-cols-3 gap-3 p-4 bg-[#141414] rounded-xl border border-[#222222] shrink-0 touch-none"
                    onPointerUp={() => setDesenhando(false)}
                    onPointerLeave={() => setDesenhando(false)}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                      const numStr = num.toString();
                      const isActive = senhaAparelho.includes(numStr);
                      return (
                        <div 
                          key={num} 
                          onPointerDown={(e) => {
                            e.currentTarget.releasePointerCapture(e.pointerId);
                            setDesenhando(true);
                            // Reinicia ou adiciona o primeiro ponto
                            setSenhaAparelho(numStr);
                          }}
                          onPointerEnter={() => {
                            if (desenhando && !senhaAparelho.includes(numStr)) {
                              setSenhaAparelho(prev => prev + numStr);
                            }
                          }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 select-none cursor-pointer ${
                            isActive 
                              ? "bg-[#F25C38] text-white border-none shadow-[0_0_12px_rgba(242,92,56,0.6)] scale-110" 
                              : "border-2 border-zinc-700 text-zinc-500 hover:border-zinc-500"
                          }`}
                        >
                          {num}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between items-end">
                      <label className="text-xs md:text-sm font-bold text-[#F25C38]">Sequência do Desenho</label>
                      <button type="button" onClick={() => setSenhaAparelho("")} className="text-xs text-zinc-400 hover:text-white underline">
                        Limpar
                      </button>
                    </div>
                    <p className="text-xs text-zinc-500 mb-1">Deslize pelas bolinhas ou digite a sequência.</p>
                    <input 
                      type="text" 
                      value={senhaAparelho} 
                      onChange={(e) => {
                        // Filtra apenas números de 1 a 9
                        const apenasNumeros = e.target.value.replace(/[^1-9]/g, "");
                        // Remove números repetidos (um padrão não repete bolinhas)
                        const semRepetidos = Array.from(new Set(apenasNumeros)).join("");
                        setSenhaAparelho(semRepetidos);
                      }}
                      placeholder="Ex: 14789" 
                      className="w-full bg-[#F25C38]/10 border border-[#F25C38]/30 rounded-xl p-4 text-white outline-none focus:border-[#F25C38] text-center tracking-[0.5em] font-bold transition-colors" 
                    />
                  </div>
                </div>
              )}

            </div>

            <button type="button" className="w-full md:w-auto mt-8 bg-[#F25C38] hover:bg-[#e04f2d] text-white px-10 py-4 rounded-2xl font-bold transition-colors">
              Gerar Ordem de Serviço
            </button>
          </div>

        </div>
      )}

      {/* aba cadastar novo cliente */}
      {abaAtiva === "novo" && (
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
            <div className="flex flex-col gap-2">
              <label className="text-xs md:text-sm font-bold text-white">CEP</label>
              <input type="text" maxLength={9} value={cepNovo} onChange={(e) => handleBuscarCep(e.target.value, setCepNovo, setEnderecoNovo)} placeholder="00000-000" className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-3.5 text-white outline-none focus:border-[#F25C38]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs md:text-sm font-bold text-white">Endereço Completo *</label>
              <input type="text" value={enderecoNovo} onChange={(e) => setEnderecoNovo(e.target.value)} placeholder="Rua, Número, Bairro" className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-3.5 text-white outline-none focus:border-[#F25C38]" />
            </div>
          </div>

          <button type="submit" disabled={carregando} className="w-full md:w-auto mt-4 flex items-center justify-center gap-2 bg-[#F25C38] hover:bg-[#e04f2d] text-white px-10 py-4 rounded-2xl font-bold transition-colors disabled:opacity-50">
            {carregando ? <Loader2 className="animate-spin" size={20} /> : "Cadastrar Cliente"}
          </button>
        </form>
      )}
    </div>
  );
}