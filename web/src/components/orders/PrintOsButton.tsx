import { Loader2, Printer } from "lucide-react";
import Alert from "@/components/common/Alert";
import { useImprimirOs } from "@/hooks/useImprimirOs";

interface PrintOsButtonProps {
  numOs: number;
}

export default function PrintOsButton({ numOs }: PrintOsButtonProps) {
  const { imprimir, imprimindo, erro } = useImprimirOs(numOs);

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={imprimir}
        disabled={imprimindo}
        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer"
      >
        {imprimindo ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Gerando...
          </>
        ) : (
          <>
            <Printer size={16} /> Imprimir O.S.
          </>
        )}
      </button>

      <Alert mensagem={erro} />
    </div>
  );
}
