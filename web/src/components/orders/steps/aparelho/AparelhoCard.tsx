import { CheckCircle2, Laptop, Smartphone, Tablet, Watch } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AparelhoDoCliente } from "@/services/deviceService";
import { estiloStatus } from "@/utils/statusOs";
import { nomeDoAparelho, semTextoDeVazio } from "./aparelhoUtils";

interface AparelhoCardProps {
  aparelho: AparelhoDoCliente;
  selecionado: boolean;
  confirmado: boolean;
  onSelecionar: () => void;
}

const ICONE_POR_CATEGORIA: Record<string, typeof Smartphone> = {
  Tablet: Tablet,
  Notebook: Laptop,
  Smartwatch: Watch,
};

function dataCurta(valor: string | null) {
  return valor ? new Date(valor).toLocaleDateString("pt-BR") : "";
}

function AparelhoCard({ aparelho, selecionado, confirmado, onSelecionar }: AparelhoCardProps) {
  const Icone = ICONE_POR_CATEGORIA[aparelho.categoria?.nmCategoria ?? ""] ?? Smartphone;
  const ultimaOs = aparelho.ordensServico[0];
  const quantidadeOs = aparelho._count.ordensServico;
  const cor = semTextoDeVazio(aparelho.cor);

  return (
    <button
      type="button"
      onClick={onSelecionar}
      aria-pressed={selecionado}
      className={cn(
        "flex w-full items-start gap-4 rounded-2xl border bg-background p-4 text-left transition-colors",
        selecionado ? "border-primary ring-3 ring-primary/15" : "border-border hover:border-primary/40",
      )}
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl",
          selecionado ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        <Icone className="size-5" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-semibold text-foreground">{nomeDoAparelho(aparelho)}</span>
          {confirmado && <CheckCircle2 className="size-4 shrink-0 text-success" />}
        </span>

        <span className="truncate text-xs text-muted-foreground">
          {cor && `${cor} · `}IMEI {aparelho.imei}
        </span>

        <span className="mt-1 text-xs text-muted-foreground">
          {ultimaOs ? (
            <>
              {quantidadeOs} O.S. · última{" "}
              <span className="font-medium text-foreground">#{ultimaOs.numOs}</span> em {dataCurta(ultimaOs.dtEntrada)}{" "}
              <span className={cn("ml-1 inline-block size-1.5 rounded-full align-middle", estiloStatus(ultimaOs.status).dot)} />
            </>
          ) : (
            "Ainda não teve O.S."
          )}
        </span>
      </span>
    </button>
  );
}

export default AparelhoCard;