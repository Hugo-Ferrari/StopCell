import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  aberto: boolean;
  titulo: string;
  descricao?: string;
  onFechar: () => void;
  children: ReactNode;
  /** largura máxima, ex: "max-w-lg" */
  tamanho?: string;
}

function Modal({ aberto, titulo, descricao, onFechar, children, tamanho = "max-w-md" }: ModalProps) {
  // fecha no Esc
  useEffect(() => {
    if (!aberto) return;
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onFechar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        // não fecha quando clica dentro do modal
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[92vh] w-full ${tamanho} flex-col rounded-t-2xl bg-card shadow-xl sm:rounded-xl`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
          <div>
            <h2 id="modal-titulo" className="text-lg font-semibold text-foreground sm:text-xl">
              {titulo}
            </h2>
            {descricao && <p className="mt-0.5 text-sm text-muted-foreground">{descricao}</p>}
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

export default Modal;