import { Smartphone } from "lucide-react";
import type { OrdemServicoInterface } from "@/pages/history/History";

interface DeviceBoxProps {
  ordens: OrdemServicoInterface[];
}

export default function DeviceBox({ ordens }: DeviceBoxProps) {
  const getStatusStyle = (status: string) => {
    if (status === "DIAGNOSTICO") return { bg: "bg-[#2A2215] border-yellow-700/50", text: "text-yellow-500", dot: "bg-yellow-500", label: "Em Diag." };
    if (status === "FINALIZADO") return { bg: "bg-[#152A1A] border-green-700/50", text: "text-green-500", dot: "bg-green-500", label: "Finalizado" };
    return { bg: "bg-[#1A1A1A] border-[#333333]", text: "text-zinc-300", dot: "bg-zinc-400", label: "Aguard. Peça" };
  };

  return (
    <div className="flex flex-col gap-4">
      {ordens.map((os) => {
        const style = getStatusStyle(os.status);
        return (
          <div key={`aparelho-${os.numOs}`} className="flex items-center justify-between bg-[#0F0F0F] border border-[#222222] rounded-[24px] p-5 md:p-6 hover:border-[#333333] transition-colors cursor-pointer group">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center shrink-0 group-hover:border-[#F25C38]/50 transition-colors">
                <Smartphone size={22} className="text-zinc-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-base md:text-lg leading-none mb-1.5">{os.aparelho.modelo}</span>
                <span className="text-zinc-400 text-xs md:text-sm">{os.cliente.nmCompleto} • {new Date(os.dtEntrada).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wide ${style.bg} ${style.text}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></div>
              {style.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}