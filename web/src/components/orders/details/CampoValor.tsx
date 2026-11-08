import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CampoValorProps {
  id: string;
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
}

// campo de dinheiro com o "R$" fixo na frente. guarda como texto pra deixar
// o técnico digitar "45,90" sem o input brigar com a vírgula
function CampoValor({ id, rotulo, valor, onChange }: CampoValorProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{rotulo}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-muted-foreground">
          R$
        </span>
        <Input
          id={id}
          inputMode="decimal"
          placeholder="0,00"
          value={valor}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, ""))}
          className="pl-10 text-right tabular-nums"
        />
      </div>
    </div>
  );
}

export default CampoValor;