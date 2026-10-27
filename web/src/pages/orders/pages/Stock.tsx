"use client";

import CardStock from "@/components/stock/CardStock";
import FilterStock from "@/components/stock/FilterStock";
import NewPeca from "@/components/stock/NewPeca";
import { listarPeca, type PecaDTO } from "@/services/pecaService";
import { ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";


function Estoque() {
  const [peca, setPeca] = useState<PecaDTO[]>([]);

  useEffect(() => {
    async function carregarPecas() {
      try {
        const dados = await listarPeca();
        setPeca(Array.isArray(dados?.data) ? dados.data : []);
      } catch (error) {
        console.error("Erro ao carregar peças:", error);
        setPeca([]);
      }
    }

    carregarPecas();
  }, []);


  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-[#F25C38] text-[10px] md:text-xs font-bold uppercase tracking-widest">
          Stop Cell
        </span>
        <h1 className="text-2xl md:text-3xl font-black mt-1 flex items-center gap-3 text-white">
          Estoque
        </h1>
      </div>
      <div className="flex gap-4 flex-wrap">
        <CardStock
          text="ITENS CADASTRADO"
          icons={ClipboardList}
          valor={peca.length}
        />
        <NewPeca/>
      </div>

      <FilterStock peca={peca} />
    </div>
  );
}

export default Estoque;
