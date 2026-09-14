import { useState } from "react";
import { Search, Loader2, Smartphone } from "lucide-react";
import { buscarClientePorCpf, type criarClienteDto } from "@/services/customerService";
import { criarAparelho } from "@/services/deviceService";
import { criarOrdemServico } from "@/services/serviceOrderService";

const CATEGORIAS = ["Smartphone", "Tablet", "Notebook", "Smartwatch", "Outro"];
const MARCAS = ["Apple", "Samsung", "Xiaomi", "Motorola", "LG", "Asus", "Realme", "Outra"];
const TIPOS_SENHA = ["Numérica (PIN)", "Alfanumérica", "Padrão (Desenho)", "Sem Senha", "Não Informada"];

interface ExistingCustomerProps {
  mostrarToast: (msg: string, tipo: "sucesso" | "erro") => void;
  clienteSelecionado: criarClienteDto;
  setClienteSelecionado: (cliente: criarClienteDto) => void;
}

export default function ExistingCustomer({ mostrarToast, clienteSelecionado, setClienteSelecionado }: ExistingCustomerProps) {
  const [cpfBusca, setCpfBusca] = useState("");
  const [buscandoCliente, setBuscandoCliente] = useState(false);
  const [gerandoOs, setGerandoOs] = useState(false);
  
  const [imei, setImei] = useState("");
  const [categoriaOs, setCategoriaOs] = useState("");
  const [marcaOs, setMarcaOs] = useState("");
  const [modelo, setModelo] = useState("");
  const [cor, setCor] = useState("");
  const [tipoSenha, setTipoSenha] = useState("");
  const [senhaAparelho, setSenhaAparelho] = useState("");
  const [desenhando, setDesenhando] = useState(false);

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

  function handleNovoAparelho() {
    setImei("");
    setCategoriaOs("");
    setMarcaOs("");
    setModelo("");
    setCor("");
    setTipoSenha("");
    setSenhaAparelho("");
    setDesenhando(false);
    mostrarToast("Campos limpos para cadastrar novo aparelho.", "sucesso");
  }

  async function handleGerarOS() {
    if (!clienteSelecionado.cpf) {
      return mostrarToast("Busque um cliente primeiro.", "erro");
    }
    if (!imei || !categoriaOs || !marcaOs) {
      return mostrarToast("Preencha os dados obrigatórios do aparelho.", "erro");
    }

    try {
      setGerandoOs(true);
      
      const idDaMarca = MARCAS.indexOf(marcaOs) + 1 || 1;
      const idDaCategoria = CATEGORIAS.indexOf(categoriaOs) + 1 || 1;

      //  Cria o aparelho 
      await criarAparelho({
        imei: imei,
        cor: cor || "Não informada",
        idCategoria: idDaCategoria,
        idMarca: idDaMarca,
        modelo: modelo || "Não informado",
        senhaAparelho: senhaAparelho || "Não possui", //se a senha do app n tiver vai enviar "não possui"
        tipoSenha: tipoSenha || "Não informada",
        cpfCliente: clienteSelecionado.cpf, 
      });

      //  Cria a Ordem de Serviço
      await criarOrdemServico({
        cpfCliente: clienteSelecionado.cpf,
        email: clienteSelecionado.email, 
        imeiAparelho: imei,
        idUsuario: 1, 
        diagnostico: "Aparelho recebido na recepção."
      });

      mostrarToast("Aparelho e Ordem de Serviço gerados com sucesso!", "sucesso");
      handleNovoAparelho(); 
      
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Erro ao processar os dados.";
      mostrarToast(Array.isArray(msg) ? msg[0] : msg, "erro");
    } finally {
      setGerandoOs(false);
    }
  }

  return (
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Smartphone size={18}/> 2. Dados do Aparelho
          </h2>
          <button 
            type="button" 
            onClick={handleNovoAparelho}
            className="bg-[#0A0A0A] border border-[#222222] text-[#F25C38] hover:bg-[#222222] px-4 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            + Novo Aparelho
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

          <div className="flex flex-col gap-2 md:col-span-2 mt-2">
            <label className="text-xs md:text-sm font-bold text-white">Tipo de Senha</label>
            <select value={tipoSenha} onChange={(e) => { setTipoSenha(e.target.value); setSenhaAparelho(""); }} className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl py-4 px-4 text-white outline-none focus:border-[#F25C38] appearance-none">
              <option value="" disabled>Selecione o tipo de bloqueio...</option>
              {TIPOS_SENHA.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {(tipoSenha === "Numérica (PIN)" || tipoSenha === "Alfanumérica") && (
            <div className="flex flex-col gap-2 md:col-span-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs md:text-sm font-bold text-[#F25C38]">Senha do Aparelho</label>
              <input type={tipoSenha === "Numérica (PIN)" ? "number" : "text"} value={senhaAparelho} onChange={(e) => setSenhaAparelho(e.target.value)} placeholder="Digite a senha de desbloqueio" className="w-full bg-[#F25C38]/10 border border-[#F25C38]/30 rounded-xl p-4 text-white outline-none focus:border-[#F25C38]" />
            </div>
          )}

          {tipoSenha === "Padrão (Desenho)" && (
            <div className="flex flex-col md:flex-row gap-6 items-center bg-[#0A0A0A] border border-[#222222] p-5 rounded-2xl md:col-span-2 animate-in fade-in slide-in-from-top-2">
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
                        setSenhaAparelho(numStr);
                      }}
                      onPointerEnter={() => {
                        if (desenhando && !senhaAparelho.includes(numStr)) {
                          setSenhaAparelho(prev => prev + numStr);
                        }
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 select-none cursor-pointer ${
                        isActive ? "bg-[#F25C38] text-white border-none shadow-[0_0_12px_rgba(242,92,56,0.6)] scale-110" : "border-2 border-zinc-700 text-zinc-500 hover:border-zinc-500"
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
                  <button type="button" onClick={() => setSenhaAparelho("")} className="text-xs text-zinc-400 hover:text-white underline">Limpar</button>
                </div>
                <p className="text-xs text-zinc-500 mb-1">Deslize pelas bolinhas ou digite a sequência.</p>
                <input 
                  type="text" 
                  value={senhaAparelho} 
                  onChange={(e) => {
                    const apenasNumeros = e.target.value.replace(/[^1-9]/g, "");
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

        <button 
          type="button" 
          onClick={handleGerarOS}
          disabled={gerandoOs}
          className="w-full md:w-auto mt-8 flex justify-center items-center gap-2 bg-[#F25C38] hover:bg-[#e04f2d] text-white px-10 py-4 rounded-2xl font-bold transition-colors disabled:opacity-50"
        >
          {gerandoOs ? <Loader2 className="animate-spin" size={20} /> : "Gerar Ordem de Serviço"}
        </button>
      </div>
    </div>
  );
}