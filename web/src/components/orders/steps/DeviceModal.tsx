import { criarAparelho, type AparelhoDto } from "@/services/deviceService";
import React, { useState } from "react";

interface DeviceModalInterface {
  aberto: boolean;
  onClose: () => void;
  clienteCpf: string;
}

function DeviceModal({ aberto, onClose, clienteCpf }: DeviceModalInterface) {
  const [modelo, setModelo] = useState("");
  const [cor, setCor] = useState("");
  const [imei, setImei] = useState("");
  const [marca, setMarca] = useState("");
  const [categoria, setCategoria] = useState(""); 
  const [senhaAparelho, setSenhaAparelho] = useState("");
  const [tipoSenha, setTipoSenha] = useState("");

  const cssInput = "w-full rounded-lg border border-[#222222] bg-[#0A0A0A] px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-[#F25C38]";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data: AparelhoDto = { 
        modelo, 
        cor, 
        imei, 
        senhaAparelho, 
        tipoSenha, 
        idMarca: 1, 
        idCategoria: 1,
        cpfCliente: clienteCpf 
      };
      
      await criarAparelho(data); 
      alert("Aparelho criado com sucesso!");
      onClose();
    } catch (err) {
      console.log(err);
      alert("Erro ao criar aparelho.");
    }
  }

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#222222] bg-[#141414] p-6 shadow-xl">
        
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Novo aparelho</h2>
          <p className="mt-1 text-sm text-zinc-400">CPF do cliente: {clienteCpf}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-white">Modelo</label>
              <input value={modelo} onChange={(e) => setModelo(e.target.value)} type="text" placeholder="Ex: iPhone 15 Pro" className={cssInput} />
            </div>

            <div>
              <label className="mb-2 block font-medium text-white">IMEI</label>
              <input value={imei} onChange={(e) => setImei(e.target.value)} type="text" placeholder="Digite o IMEI" className={cssInput} />
            </div>

            <div>
              <label className="mb-2 block font-medium text-white">Cor</label>
              <input value={cor} onChange={(e) => setCor(e.target.value)} type="text" placeholder="Ex: Preto" className={cssInput} />
            </div>

            <div>
              <label className="mb-2 block font-medium text-white">Marca</label>
              <input value={marca} onChange={(e) => setMarca(e.target.value)} type="text" placeholder="Ex: Apple" className={cssInput} />
            </div>

            <div>
              <label className="mb-2 block font-medium text-white">Categoria</label>
              <input value={categoria} onChange={(e) => setCategoria(e.target.value)} type="text" placeholder="Ex: Smartphone" className={cssInput} />
            </div>

            <div>
              <label className="mb-2 block font-medium text-white">Tipo de bloqueio</label>
              <select value={tipoSenha} onChange={(e) => setTipoSenha(e.target.value)} className={cssInput}>
                <option value="">Selecione...</option>
                <option value="PIN">Numérica (PIN)</option>
                <option value="PADRAO">Padrão (Desenho)</option>
                <option value="TEXTO">Alfanumérica</option>
                <option value="NENHUMA">Sem Senha</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-white">Senha do aparelho</label>
              <input value={senhaAparelho} onChange={(e) => setSenhaAparelho(e.target.value)} type="text" placeholder="Senha/Padrão" className={cssInput} />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-xl border border-[#222222] px-6 py-3 text-zinc-400 hover:text-white hover:bg-[#222222] transition-colors font-semibold">
              Cancelar
            </button>
            <button type="submit" className="rounded-xl bg-[#F25C38] px-6 py-3 font-bold text-white hover:opacity-90 transition-opacity">
              Salvar Aparelho
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeviceModal;