import { useState, useEffect } from "react";
import { ClipboardList, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { buscarUltimaOsPorImei } from "@/services/serviceOrderService";

const ITENS_CHECKLIST = [
  "Tela / Touch", "Botões", "Câmera frontal", "Câmera traseira",
  "Conector de carga", "Som / Alto-falante", "Microfone",
  "Wi-Fi / Rede", "Biometria / Face ID", "Bateria",
  "Avarias físicas", "Chip / SIM"
];

interface ChecklistFormProps {
  imeiAparelho: string;
  dadosChecklist: any;
  setDadosChecklist: (dados: any) => void;
}

export default function ChecklistForm({ imeiAparelho, dadosChecklist, setDadosChecklist }: ChecklistFormProps) {
  const [buscandoOsAnterior, setBuscandoOsAnterior] = useState(false);

  useEffect(() => {
    async function fetchUltimaOs() {
      if (!imeiAparelho) return;
      try {
        setBuscandoOsAnterior(true);
        
        const ultimaOs = await buscarUltimaOsPorImei(imeiAparelho);
        
        if (ultimaOs && ultimaOs.numOs) {
          updateCampo("osAnterior", String(ultimaOs.numOs));
        }
      } catch (error) {
        console.error("Nenhuma O.S. anterior encontrada ou erro na busca.", error);
      } finally {
        setBuscandoOsAnterior(false);
      }
    }

    fetchUltimaOs();
  }, [imeiAparelho]);

  
  const updateCampo = (campo: string, valor: any) => {
    setDadosChecklist((prev: any) => ({ ...prev, [campo]: valor }));
  };

  const updateChecklistItem = (index: number, status: "OK" | "NOK" | "NA", obs?: string) => {
    const novosItens = [...dadosChecklist.itens];
    if (status) novosItens[index].status = status;
    if (obs !== undefined) novosItens[index].obs = obs;
    updateCampo("itens", novosItens);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2">
      
      
      <div className="bg-[#141414] border border-[#222222] rounded-3xl p-5 md:p-8">
        <h2 className="text-[#F25C38] text-sm font-bold flex items-center gap-2 mb-6 uppercase tracking-wider">
          <ClipboardList size={18} /> Ordem de Serviço
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs md:text-sm font-bold text-white">Técnico Responsável</label>
            <input 
              type="text" 
              placeholder="Quem recebeu o aparelho" 
              value={dadosChecklist.tecnico} 
              onChange={(e) => updateCampo("tecnico", e.target.value)} 
              className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 text-white outline-none focus:border-[#F25C38]" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs md:text-sm font-bold text-white flex justify-between">
              <span>O.S. Anterior (retrabalho)</span>
              {buscandoOsAnterior && <span className="text-[#F25C38] text-xs animate-pulse">Buscando...</span>}
            </label>
            <input 
              type="text" 
              placeholder="Ex: 2026-085" 
              value={dadosChecklist.osAnterior} 
              onChange={(e) => updateCampo("osAnterior", e.target.value)} 
              className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 text-white outline-none focus:border-[#F25C38]" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs md:text-sm font-bold text-white">Relato do Problema *</label>
          <textarea 
            rows={4} 
            placeholder="Descreva o problema do aparelho relatado pelo cliente..." 
            value={dadosChecklist.relato} 
            onChange={(e) => updateCampo("relato", e.target.value)} 
            className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 text-white outline-none focus:border-[#F25C38] resize-none" 
          />
        </div>
      </div>

      
      <div className="bg-[#141414] border border-[#222222] rounded-3xl p-5 md:p-8">
        <h2 className="text-[#F25C38] text-sm font-bold flex items-center gap-2 mb-2 uppercase tracking-wider">
          <CheckCircle2 size={18} /> Checklist de Entrada
        </h2>
        <p className="text-zinc-400 text-sm mb-6">Marque o estado de cada item no momento do recebimento do aparelho.</p>

        <div className="flex flex-col gap-6">
          {dadosChecklist.itens.map((item: any, index: number) => (
            <div key={item.nome} className="flex flex-col gap-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <span className="text-white font-bold">{item.nome}</span>
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => updateChecklistItem(index, "OK")} 
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${item.status === "OK" ? "bg-green-500/10 border-green-500/50 text-green-500" : "bg-transparent border-[#222222] text-zinc-500 hover:border-zinc-500"}`}
                  >
                    <CheckCircle2 size={14} /> OK
                  </button>
                  <button 
                    type="button" 
                    onClick={() => updateChecklistItem(index, "NOK")} 
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${item.status === "NOK" ? "bg-red-500/10 border-red-500/50 text-red-500" : "bg-transparent border-[#222222] text-zinc-500 hover:border-zinc-500"}`}
                  >
                    <XCircle size={14} /> NÃO OK
                  </button>
                  <button 
                    type="button" 
                    onClick={() => updateChecklistItem(index, "NA")} 
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${item.status === "NA" ? "bg-zinc-500/10 border-zinc-500/50 text-zinc-300" : "bg-transparent border-[#222222] text-zinc-500 hover:border-zinc-500"}`}
                  >
                    <MinusCircle size={14} /> N/A
                  </button>
                </div>
              </div>
              <input 
                type="text" 
                placeholder="Observação (opcional)" 
                value={item.obs} 
                onChange={(e) => updateChecklistItem(index, item.status, e.target.value)} 
                className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-4 py-2 text-sm text-zinc-300 outline-none focus:border-[#F25C38]" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { ITENS_CHECKLIST };