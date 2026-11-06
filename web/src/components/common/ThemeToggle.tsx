import { Moon, Sun } from "lucide-react";
import type { Tema } from "@/context/temaContext";
import { useTema } from "@/hooks/useTema";

const opcoes = [
  { valor: "claro", rotulo: "Tema claro", Icone: Sun },
  { valor: "escuro", rotulo: "Tema escuro", Icone: Moon },
] satisfies { valor: Tema; rotulo: string; Icone: typeof Sun }[];

export default function ThemeToggle() {
  const { tema, definirTema } = useTema();

  return (
    <div className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-card p-1 shadow-lg">
      {opcoes.map(({ valor, rotulo, Icone }) => (
        <button
          key={valor}
          type="button"
          onClick={() => definirTema(valor)}
          aria-label={rotulo}
          aria-pressed={tema === valor}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            tema === valor
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icone className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
