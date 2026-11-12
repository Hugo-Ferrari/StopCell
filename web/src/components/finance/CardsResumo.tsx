import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import type { ResumoFinanceiro } from "@/services/financeiroService";
import { formatarMoeda } from "@/utils/moeda";

interface CardsResumoProps {
  resumo: ResumoFinanceiro;
}

function CardsResumo({ resumo }: CardsResumoProps) {
  const cards = [
    {
      rotulo: "Receitas",
      valor: resumo.totalReceitas,
      detalhe: `${resumo.quantidadeOsFinalizadas} O.S. finalizada(s)`,
      icone: ArrowUpRight,
      cor: "text-success",
    },
    {
      rotulo: "Despesas",
      valor: resumo.totalDespesas,
      detalhe: `${resumo.quantidadeDespesas} lançamento(s)`,
      icone: ArrowDownRight,
      cor: "text-destructive",
    },
    {
      rotulo: "Saldo",
      valor: resumo.saldo,
      detalhe: "Receitas − despesas",
      icone: Wallet,
      cor: resumo.saldo >= 0 ? "text-success" : "text-destructive",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map(({ rotulo, valor, detalhe, icone: Icone, cor }) => (
        <div key={rotulo} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {rotulo}
            <Icone className={`size-4 ${cor}`} />
          </div>
          <p className={`mt-2 text-2xl font-bold tabular-nums ${cor}`}>{formatarMoeda(valor)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{detalhe}</p>
        </div>
      ))}
    </div>
  );
}

export default CardsResumo;
