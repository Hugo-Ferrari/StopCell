import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Bell, SlidersHorizontal } from "lucide-react";

import BoxOs from "@/components/history/BoxOs";
import { listarOs } from "@/services/serviceOrderService";
import type { OrdemServicoInterface } from "../models/WorkOrder";

// corrigir filtros( EM_REPARO, AGUARDANDO_PEÇA, EM_REPARO, FINALIZADO)
function OrdemServico() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todas");
  const [ordens, setOrdens] = useState<OrdemServicoInterface[]>([]);

  useEffect(() => {
    async function carregarOs() {
      try {
        const dados = await listarOs();
        console.log(dados)
        setOrdens(dados);
        
      } catch (error) {
        console.error("Erro ao carregar Ordens de Serviço:", error);
      }
    }
    carregarOs();
  }, []);

  const metricas = useMemo(() => {
    return {
      diagnostico: ordens.filter(o => o.status === "DIAGNOSTICO").length,
      aguardandoPeca: ordens.filter(o => o.status === "ABERTA").length,
      emReparo: ordens.filter(o => o.status === "EM_REPARO").length,
      finalizado: ordens.filter(o => o.status === "FINALIZADO").length,
    };
  }, [ordens]);

  const ordensFiltradas = useMemo(() => {
    return ordens.filter((ordem) => {
      const passaFiltroStatus =
        filtroStatus === "Todas" ||
        (filtroStatus === "Em Diagn." && ordem.status === "DIAGNOSTICO") ||
        (filtroStatus === "Aguard. Peça" && ordem.status === "ABERTA") ||
        (filtroStatus === "Em Reparo" && ordem.status === "EM_REPARO") ||
        (filtroStatus === "Finalizado" && ordem.status === "FINALIZADO");

      const termoBusca = busca.toLowerCase();
      const passaBusca =
        busca === "" ||
        ordem.cliente?.nmCompleto?.toLowerCase().includes(termoBusca) ||
        ordem.numOs?.toString().includes(termoBusca) ||
        ordem.aparelho?.modelo?.toLowerCase().includes(termoBusca);

      return passaFiltroStatus && passaBusca;
    });
  }, [ordens, busca, filtroStatus]);

  const chips = ["Todas", "Em Diagn.", "Aguard. Peça", "Em Reparo", "Finalizado"];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 md:mb-8">
        <div>
          <span className="text-[#F25C38] text-[10px] md:text-xs font-bold uppercase tracking-widest">Stop Cell</span>
          <h1 className="text-2xl md:text-3xl font-bold mt-1 text-white">Ordens de Serviço</h1>
        </div>
        <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto justify-between sm:justify-end">
          <Link
            to="/nova-ordem-servico"
            className="flex items-center justify-center gap-2 rounded-full bg-[#F25C38] px-4 md:px-5 py-2 md:py-2.5 text-sm font-semibold text-black hover:bg-[#e04f2d] transition-colors flex-1 sm:flex-none"
          >
            <Plus size={18} strokeWidth={2.5} /> Nova O.S.
          </Link>
          <button className="text-zinc-300 hover:text-white transition-colors p-2 bg-[#141414] sm:bg-transparent rounded-full sm:rounded-none">
            <Bell size={22} />
          </button>
        </div>
      </div>

      {/* busca e filtro da OS */}
      <div className="flex gap-2 md:gap-4 mb-6 md:mb-8">
        <div className="flex flex-1 items-center rounded-2xl bg-[#141414] border border-[#222222] px-3 md:px-4 py-1 md:py-1.5 focus-within:border-[#F25C38] transition-colors">
          <Search size={18} className="mr-2 md:mr-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar O.S., Cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-transparent p-2 text-sm md:text-base text-zinc-200 placeholder:text-zinc-500 outline-none"
          />
        </div>
        <button className="flex items-center justify-center rounded-2xl border border-[#F25C38] bg-[#141414] p-3 text-[#F25C38] hover:bg-[#F25C38]/10 transition-colors shrink-0">
          <SlidersHorizontal size={18} className="md:w-5 md:h-5" />
        </button>
      </div>

      {/* status da os   */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-[#141414] border border-[#222222] rounded-2xl p-4 md:p-5 flex flex-col justify-between min-h-[90px] md:min-h-[110px]">
          <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-[11px] font-bold text-zinc-400 tracking-wider">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-yellow-500"></div> EM DIAGN.
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white mt-2">{metricas.diagnostico}</div>
        </div>

        <div className="bg-[#141414] border border-[#222222] rounded-2xl p-4 md:p-5 flex flex-col justify-between min-h-[90px] md:min-h-[110px]">
          <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-[11px] font-bold text-zinc-400 tracking-wider">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-zinc-400"></div> AGUARD. PEÇA
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white mt-2">{metricas.aguardandoPeca}</div>
        </div>

        <div className="bg-[#141414] border border-[#222222] rounded-2xl p-4 md:p-5 flex flex-col justify-between min-h-[90px] md:min-h-[110px]">
          <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-[11px] font-bold text-zinc-400 tracking-wider">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500"></div> EM REPARO
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white mt-2">{metricas.emReparo}</div>
        </div>

        <div className="bg-[#141414] border border-[#222222] rounded-2xl p-4 md:p-5 flex flex-col justify-between min-h-[90px] md:min-h-[110px]">
          <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-[11px] font-bold text-zinc-400 tracking-wider">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500"></div> FINALIZADO
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white mt-2">{metricas.finalizado}</div>
        </div>
      </div>

      {/* filtro para pesquisar  */}
      <div className="flex gap-2 md:gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide w-full snap-x">
        {chips.map((chip) => (
          <button
            key={chip}
            onClick={() => setFiltroStatus(chip)}
            className={`snap-start whitespace-nowrap px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all border ${
              filtroStatus === chip
                ? "bg-[#F25C38] border-[#F25C38] text-black"
                : "bg-[#141414] border-[#222222] text-zinc-400 hover:text-white"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* listas de os */}
      <BoxOs ordens={ordensFiltradas} />

    </div>
  );
}

export default OrdemServico;