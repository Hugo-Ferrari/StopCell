import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mascaraValor } from "@/utils/moeda";

interface CampoValorProps {
  id: string;
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  onBlur?: () => void;
  erro?: string;
}

function CampoValor({ id, rotulo, valor, onChange, onBlur, erro }: CampoValorProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{rotulo}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-muted-foreground">
          R$
        </span>
        <Input
          id={id}
          inputMode="numeric"
          placeholder="0,00"
          value={valor}
          onChange={(e) => onChange(mascaraValor(e.target.value))}
          onBlur={onBlur}
          aria-invalid={erro ? true : undefined}
          className="pl-10 text-right tabular-nums"
        />
      </div>
      {erro && <span className="text-xs text-destructive">{erro}</span>}
    </div>
  );
}

export default CampoValor;
