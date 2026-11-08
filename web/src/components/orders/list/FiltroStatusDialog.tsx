import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import OpcaoFiltroItem from "./OpcaoFiltroItem";
import { OPCOES_FILTRO, type FiltroOs } from "@/utils/filtroOs";
import { cn } from "@/lib/utils";

interface FiltroStatusDialogProps {
  aplicados: FiltroOs[];
  contagem: Record<FiltroOs, number>;
  onAplicar: (filtros: FiltroOs[]) => void;
}

function FiltroStatusDialog({ aplicados, contagem, onAplicar }: FiltroStatusDialogProps) {
  const [aberto, setAberto] = useState(false);
  // o que está marcado no modal só vale depois do "Aplicar", por isso fica separado
  const [rascunho, setRascunho] = useState<FiltroOs[]>(aplicados);

  function handleAbrir(abrir: boolean) {
    // toda vez que abre, começa do que está aplicado (descarta o que ficou sem aplicar)
    if (abrir) setRascunho(aplicados);
    setAberto(abrir);
  }

  function alternar(filtro: FiltroOs) {
    setRascunho((atual) =>
      atual.includes(filtro) ? atual.filter((f) => f !== filtro) : [...atual, filtro],
    );
  }

  function aplicar() {
    onAplicar(rascunho);
    setAberto(false);
  }

  function limpar() {
    onAplicar([]);
    setAberto(false);
  }

  const temFiltro = aplicados.length > 0;

  return (
    <Dialog open={aberto} onOpenChange={handleAbrir}>
      <DialogTrigger
        aria-label="Filtrar por status"
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-2xl border bg-card p-3 transition-colors",
          temFiltro
            ? "border-primary text-primary hover:bg-primary/10"
            : "border-border text-muted-foreground hover:border-primary hover:text-primary",
        )}
      >
        <SlidersHorizontal size={20} />
        {temFiltro && (
          <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
            {aplicados.length}
          </span>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtrar por status</DialogTitle>
          <DialogDescription>Marque um ou mais para ver só essas ordens.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2.5">
          {OPCOES_FILTRO.map((opcao) => (
            <OpcaoFiltroItem
              key={opcao.valor}
              opcao={opcao}
              quantidade={contagem[opcao.valor] ?? 0}
              marcado={rascunho.includes(opcao.valor)}
              onAlternar={() => alternar(opcao.valor)}
            />
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={limpar} className="h-12 rounded-2xl text-base font-semibold">
            Limpar
          </Button>
          <Button onClick={aplicar} className="h-12 rounded-2xl text-base font-semibold">
            Aplicar filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FiltroStatusDialog;