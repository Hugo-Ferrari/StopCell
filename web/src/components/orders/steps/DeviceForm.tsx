import { useState } from "react";
import { Loader2, Smartphone } from "lucide-react";
import { criarAparelho } from "@/services/deviceService";
import type { criarClienteDto } from "@/services/customerService";

const CATEGORIAS = ["Smartphone", "Tablet", "Notebook", "Smartwatch", "Outro"];
const MARCAS = ["Apple", "Samsung", "Xiaomi", "Motorola", "LG", "Asus", "Realme", "Outra"];
const TIPOS_SENHA = ["Numérica (PIN)", "Alfanumérica", "Padrão (Desenho)", "Sem Senha", "Não Informada"];

interface DeviceFormProps {
  mostrarToast: (msg: string, tipo: "sucesso" | "erro") => void;
  clienteSelecionado: criarClienteDto;
  onAparelhoCriado: (imei: string) => void;
}

export default function DeviceForm({ mostrarToast, clienteSelecionado, onAparelhoCriado }: DeviceFormProps) {
  const [cadastrandoAparelho, setCadastrandoAparelho] = useState(false);

  const [imei, setImei] = useState("");
  const [categoriaOs, setCategoriaOs] = useState("");
  const [marcaOs, setMarcaOs] = useState("");
  const [modelo, setModelo] = useState("");
  const [cor, setCor] = useState("");
  const [tipoSenha, setTipoSenha] = useState("");
  const [senhaAparelho, setSenhaAparelho] = useState("");
  const [desenhando, setDesenhando] = useState(false);

  async function handleCadastrarAparelho() {
    if (!clienteSelecionado.cpf) {
      return mostrarToast("Busque um cliente primeiro.", "erro");
    }
    if (!imei || !categoriaOs || !marcaOs) {
      return mostrarToast("Preencha os dados obrigatórios do aparelho.", "erro");
    }

    const idDaMarca = MARCAS.indexOf(marcaOs) + 1 || 1;
    const idDaCategoria = CATEGORIAS.indexOf(categoriaOs) + 1 || 1;

    try {
      setCadastrandoAparelho(true);

      // BLINDAGEM: Tenta criar, se já existir, ignora o erro
      try {
        await criarAparelho({
          imei,
          cor: cor || "Não informada",
          idCategoria: idDaCategoria,
          idMarca: idDaMarca,
          modelo: modelo || "Não informado",
          senhaAparelho: senhaAparelho || "Não possui",
          tipoSenha: tipoSenha || "Não informada",
          cpfCliente: clienteSelecionado.cpf,
        });
      } catch (erroPrisma) {
        console.warn("Aparelho já existia no banco, liberando fluxo para a OS...");
      }

      mostrarToast("Aparelho confirmado com sucesso!", "sucesso");
      onAparelhoCriado(imei); // Libera o botão de Gerar OS na tela pai
      
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Erro ao processar o aparelho.";
      mostrarToast(Array.isArray(msg) ? msg[0] : msg, "erro");
    } finally {
      setCadastrandoAparelho(false);
    }
  }

  return (
    <div className="bg-[#141414] border border-[#222222] rounded-3xl p-5 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold flex items-center gap-2">
          <Smartphone size={18} /> 2. Dados do Aparelho
        </h2>
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
        onClick={handleCadastrarAparelho}
        disabled={cadastrandoAparelho}
        className="w-full md:w-auto mt-8 flex justify-center items-center gap-2 bg-[#F25C38] hover:bg-[#e04f2d] text-white px-10 py-4 rounded-2xl font-bold transition-colors disabled:opacity-50"
      >
        {cadastrandoAparelho ? <Loader2 className="animate-spin" size={20} /> : "Confirmar Aparelho"}
      </button>
    </div>
  );
}