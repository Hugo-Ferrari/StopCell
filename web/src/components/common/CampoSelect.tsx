import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

export interface OpcaoSelect<T extends string | number> {
  value: T;
  label: string;
}

interface CampoSelectProps<T extends string | number> {
  id?: string;
  value: T | null;
  opcoes: OpcaoSelect<T>[];
  onChange: (valor: T) => void;
  placeholder?: string;
  disabled?: boolean;
  invalido?: boolean;
  className?: string;
}

// substitui o <select> nativo, que não dá pra estilizar a lista aberta.
// o texto do campo é montado aqui pra mostrar o nome da opção, não o valor
function CampoSelect<T extends string | number>({
  id,
  value,
  opcoes,
  onChange,
  placeholder = "Selecione...",
  disabled,
  invalido,
  className,
}: CampoSelectProps<T>) {
  const selecionada = opcoes.find((opcao) => opcao.value === value);

  return (
    <Select
      value={value}
      onValueChange={(novo) => {
        if (novo !== null && novo !== undefined) onChange(novo as T);
      }}
      disabled={disabled}
    >
      <SelectTrigger id={id} aria-invalid={invalido || undefined} className={className}>
        {selecionada ? selecionada.label : <span className="text-muted-foreground">{placeholder}</span>}
      </SelectTrigger>

      <SelectContent>
        {opcoes.map((opcao) => (
          <SelectItem key={opcao.value} value={opcao.value}>
            {opcao.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default CampoSelect;