import type { OrdemServicoInterface } from "@/pages/history/History";

interface CostumerBoxProps {
  ordens: OrdemServicoInterface[];
}

export default function CostumerBox({ ordens }: CostumerBoxProps) {
  return (
    <div className="flex flex-col gap-4">
      {ordens.map((os) => (
        <div key={`cliente-${os.numOs}`} className="flex items-center justify-between bg-[#0F0F0F] border border-[#222222] rounded-[24px] p-5 md:p-6 hover:border-[#333333] transition-colors cursor-pointer group">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-[#F25C38] flex items-center justify-center shrink-0">
              <span className="text-black font-bold text-lg">{os.cliente.nmCompleto.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-base md:text-lg leading-none mb-1.5">{os.cliente.nmCompleto}</span>
              <span className="text-zinc-400 text-xs md:text-sm">Última O.S.: {new Date(os.dtEntrada).toLocaleDateString("pt-BR")} • {os.aparelho.modelo}</span>
            </div>
          </div>
          <div className="text-zinc-400 text-xs md:text-sm font-medium">
            TOTAL <span className="text-white font-bold text-sm md:text-base ml-1">---</span>
          </div>
        </div>
      ))}
    </div>
  );
}