import { Loader2 } from "lucide-react";

interface CarregandoTelaProps {
  telaCheia?: boolean;
}

function CarregandoTela({ telaCheia = false }: CarregandoTelaProps) {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className={`flex items-center justify-center ${telaCheia ? "min-h-screen bg-background" : "h-64"}`}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default CarregandoTela;
