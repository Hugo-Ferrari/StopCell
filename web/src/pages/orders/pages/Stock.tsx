"use client";

import CardStock from "@/components/common/stock/CardStock";
import FilterStock from "@/components/common/stock/FilterStock";
import { listarPeca, type PecaDTO } from "@/services/pecaService";
import { AlertTriangle, Boxes, ClipboardList, DollarSign } from "lucide-react";
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

  const unidadesEstoque = peca.reduce(
    (total, item) => total + item.quantidade,
    0,
  );
  const estoqueBaixo = peca.filter(
    (item) => item.quantidade > 0 && item.quantidade <= 5,
  );
  const valorInvestido = peca.reduce(
    (total, item) => total + item.quantidade * item.valor,
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4 flex-wrap">
        <CardStock
          text="ITENS CADASTRADO"
          icons={ClipboardList}
          valor={peca.length}
        />

        <CardStock
          text="UNIDADE EM ESTOQUE"
          icons={Boxes}
          valor={unidadesEstoque}
        />

        <CardStock
          text="ESTOQUE BAIXO"
          icons={AlertTriangle}
          valor={estoqueBaixo.length}
        />

        <CardStock
          text="VALOR INVESTIDO"
          icons={DollarSign}
          valor={valorInvestido}
        />
      </div>

      <FilterStock peca={peca} />
    </div>
  );
}

export default Estoque;
