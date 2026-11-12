import { CheckCircle2, XCircle } from "lucide-react";

export type TipoToast = "sucesso" | "erro";

interface ToastProps {
  mensagem?: string | null;
  tipo?: TipoToast;
}

const estilos = {
  sucesso: "border-success/40 bg-card text-success",
  erro: "border-destructive/40 bg-card text-destructive",
};

function Toast({ mensagem, tipo = "sucesso" }: ToastProps) {
  if (!mensagem) return null;

  const Icone = tipo === "sucesso" ? CheckCircle2 : XCircle;

  return (
    <div
      role={tipo === "erro" ? "alert" : "status"}
      className={`fixed top-24 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl animate-in fade-in-0 slide-in-from-top-5 ${estilos[tipo]}`}
    >
      <Icone size={22} className="shrink-0" />
      <span className="text-sm font-bold">{mensagem}</span>
    </div>
  );
}

export default Toast;
