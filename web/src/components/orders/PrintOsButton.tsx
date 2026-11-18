import { Loader2, Printer } from "lucide-react";
import Alert from "@/components/common/Alert";
import { Button } from "@/components/ui/button";
import { useImprimirOs } from "@/hooks/useImprimirOs";

interface PrintOsButtonProps {
  numOs: number;
}

export default function PrintOsButton({ numOs }: PrintOsButtonProps) {
  const { imprimir, imprimindo, erro } = useImprimirOs(numOs);

  return (
    <div className="flex flex-col items-end gap-2">
      <Button onClick={imprimir} disabled={imprimindo} className="h-10 rounded-xl px-5">
        {imprimindo ? <Loader2 className="size-4 animate-spin" /> : <Printer className="size-4" />}
        {imprimindo ? "Gerando..." : "Imprimir O.S."}
      </Button>

      <Alert mensagem={erro} />
    </div>
  );
}
