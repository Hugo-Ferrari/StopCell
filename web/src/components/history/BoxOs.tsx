import { Smartphone } from "lucide-react";
import type { OrdemServicoInterface } from "@/pages/history/History";

interface BoxOsProps {
  ordens: OrdemServicoInterface[];
}

export default function BoxOs({ ordens }: BoxOsProps) {
  const getStatusStyle = (status: string) => {
    if (status === "DIAGNOSTICO")
      return {
        bg: "bg-[#2A2215] border-yellow-700/50",
        text: "text-yellow-500",
        dot: "bg-yellow-500",
        label: "Em Diag.",
      };
    if (status === "EM_REPARO")
      return {
        bg: "bg-[#15202A] border-blue-700/50",
        text: "text-blue-400",
        dot: "bg-blue-400",
        label: "Em Reparo",
      };
    if (status === "FINALIZADO")
      return {
        bg: "bg-[#152A1A] border-green-700/50",
        text: "text-green-500",
        dot: "bg-green-500",
        label: "Finalizado",
      };
    return {
      bg: "bg-[#1A1A1A] border-[#333333]",
      text: "text-zinc-300",
      dot: "bg-zinc-400",
      label: "Aguard. Peça",
    };
  };

  return (
    <div className="flex flex-col gap-4">
      {ordens.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#2A2A2A] bg-[#0F0F0F] px-6 py-10 text-center">
          <Smartphone className="mx-auto mb-3 text-zinc-600" size={28} />
          <p className="text-sm font-medium text-zinc-300">
            Nenhuma ordem de serviço encontrada.
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Tente alterar a busca ou o filtro selecionado.
          </p>
        </div>
      )}
      {ordens.map((os) => {
        const style = getStatusStyle(os.status);
        return (
          <div
            key={os.numOs}
            className="flex items-center justify-between gap-4 rounded-2xl border border-[#222222] bg-[#0F0F0F] p-4 transition-colors hover:border-[#333333] group sm:p-5 md:p-6"
          >
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center shrink-0 group-hover:border-[#F25C38]/50 transition-colors">
                <Smartphone size={22} className="text-zinc-400" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-zinc-500 text-xs md:text-sm font-medium mb-0.5">
                  #{os.numOs}
                </span>
                <span className="truncate text-base font-bold leading-none text-white md:text-lg">
                  {os.cliente?.nmCompleto || "Cliente não informado"}
                </span>
                <span className="truncate text-xs text-zinc-400 md:text-sm">
                  {os.aparelho?.modelo || "Aparelho não informado"} •{" "}
                  {new Date(os.dtEntrada).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
            <div
              className={`flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1.5 text-[10px] font-bold tracking-wide sm:px-3 sm:text-xs ${style.bg} ${style.text}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></div>
              <span className="hidden sm:inline">{style.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
