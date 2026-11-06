import { Moon, Sun } from "lucide-react";
import type { Tema } from "@/context/temaContext";
import { useTema } from "@/hooks/useTema";

const opcoes = [
  { valor: "claro", Icone: Sun },
  { valor: "escuro", Icone: Moon },
] satisfies { valor: Tema; Icone: typeof Sun }[];

export default function ThemeToggle() {
  const { tema, definirTema } = useTema();
  const proximoTema = tema === "claro" ? "escuro" : "claro";

  return (
    <button
      type="button"
      onClick={() => definirTema(proximoTema)}
      aria-label={`Mudar para o tema ${proximoTema}`}
      className="group flex shrink-0 items-center gap-1 rounded-full border border-border bg-card p-1 shadow-lg"
    >
      {opcoes.map(({ valor, Icone }) => (
        <span
          key={valor}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            tema === valor
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground group-hover:text-foreground"
          }`}
        >
          <Icone className="h-4 w-4" />
        </span>
      ))}
    </button>
  );
}
