import { useState } from "react";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Despesa } from "@/services/financeiroService";
import { formatarMoeda } from "@/utils/moeda";
import FormularioDespesa from "./FormularioDespesa";
import ListaDespesas from "./ListaDespesas";
import { cn } from "@/lib/utils";

interface DespesasCardProps {
  despesas: Despesa[];
  onAlterado: () => Promise<void>;
}

// o formulário fica num modal: na maior parte do tempo a pessoa só quer ver a lista
function DespesasCard({ despesas, onAlterado }: DespesasCardProps) {
  const [aberto, setAberto] = useState(false);
  const total = despesas.reduce((soma, d) => soma + d.valor, 0);

  async function handleCriada() {
    setAberto(false);
    await onAlterado();
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Despesas</h2>
          <p className="text-sm text-muted-foreground tabular-nums">
            {despesas.length > 0
              ? `${despesas.length} no período · ${formatarMoeda(total)}`
              : "Aluguel, energia, material..."}
          </p>
        </div>

        <Dialog open={aberto} onOpenChange={setAberto}>
          <DialogTrigger className={cn(buttonVariants(), "h-9 shrink-0 rounded-lg px-3")}>
            <Plus /> Nova despesa
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova despesa</DialogTitle>
              <DialogDescription>Entra no saldo do dia que você escolher.</DialogDescription>
            </DialogHeader>
            <FormularioDespesa onCriada={handleCriada} />
          </DialogContent>
        </Dialog>
      </div>

      <ListaDespesas despesas={despesas} onRemovida={onAlterado} />
    </section>
  );
}

export default DespesasCard;