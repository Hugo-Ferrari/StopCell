import { useEffect, type ReactNode } from "react";
import { CheckCircle2, TriangleAlert, X, XCircle } from "lucide-react";
import { useAvisos } from "@/hooks/useAvisos";

export type TipoToast = "sucesso" | "erro" | "aviso";

const estilos = {
  sucesso: "border-success/40 text-success",
  erro: "border-destructive/40 text-destructive",
  aviso: "border-warning/40 text-warning",
};

const icones = {
  sucesso: CheckCircle2,
  erro: XCircle,
  aviso: TriangleAlert,
};

interface ToastItemProps {
  mensagem: ReactNode;
  tipo: TipoToast;
  onFechar?: () => void;
}

export function ToastItem({ mensagem, tipo, onFechar }: ToastItemProps) {
  const Icone = icones[tipo];

  return (
    <div
      role={tipo === "erro" ? "alert" : "status"}
      className={`pointer-events-auto flex w-full items-center gap-3 rounded-2xl border bg-card px-5 py-4 shadow-2xl animate-in fade-in-0 slide-in-from-right-5 ${estilos[tipo]}`}
    >
      <Icone size={22} className="shrink-0" />
      <span className="flex-1 whitespace-pre-line text-sm font-bold">{mensagem}</span>
      {onFechar && (
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar aviso"
          className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

interface ToastProps {
  mensagem?: string | null;
  tipo?: TipoToast;
}

function Toast({ mensagem, tipo = "sucesso" }: ToastProps) {
  const { mostrar } = useAvisos();

  useEffect(() => {
    if (mensagem) mostrar(mensagem, tipo);
  }, [mensagem, tipo, mostrar]);

  return null;
}

export default Toast;
