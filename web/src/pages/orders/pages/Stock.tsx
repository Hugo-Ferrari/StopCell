"use client "
import CardStock from "@/components/common/stock/CardStock";
import { listarPeca, type PecaDTO } from "@/services/pecaService";
import { AlertTriangle, Boxes, ClipboardList, DollarSign } from "lucide-react";
import  { useEffect, useState } from "react";

function Estoque() {
  const [peca, setPeca] = useState<PecaDTO[]>([])
  useEffect(()=>{
    async function carregarPecas() {
      const dados = await listarPeca()
      setPeca(dados.data)
    }
    carregarPecas()
  },[])

  const estoqueBaixo = peca.filter((peca)=> peca.quantidade > 0 && peca.quantidade <= 5)
   const unidadesEstoque = peca.reduce(
    (total, peca) => total + peca.quantidade,
    0
  );

  const valorInvestido = peca.reduce(
    (total, peca) => total + peca.quantidade * peca.valor,
    0

  );
  return (
    <div className="flex gap-4">
      <div className=" ">
        <CardStock text="ITENS CADASTRADO" icons={ClipboardList} valor={peca.length} />
      </div>
      <div>
        <CardStock text="UNIDADE EM ESTOQUE" icons={Boxes} valor={unidadesEstoque} />
      </div>
      <div>
        <CardStock text="ESTOQUE BAIXO" icons={AlertTriangle} valor={estoqueBaixo.length} />
      </div>
      <div>
        <CardStock text="VALOR INVESTIDO" icons={DollarSign} valor={valorInvestido} />
      </div>
    </div>
  );
}

export default Estoque;
