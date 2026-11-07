import { useEffect, useMemo, useState, type ReactNode } from "react";
import { TemaContext, type Tema } from "./temaContext";

// a mesma chave é lida no index.html, pra aplicar o tema antes da tela aparecer
const CHAVE_TEMA = "tema";

export function TemaProvider({ children }: { children: ReactNode }) {
  // o escuro continua sendo o padrão de quem ainda não escolheu
  const [tema, setTema] = useState<Tema>(() =>
    localStorage.getItem(CHAVE_TEMA) === "claro" ? "claro" : "escuro"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", tema === "escuro");
    localStorage.setItem(CHAVE_TEMA, tema);
  }, [tema]);

  const value = useMemo(() => ({ tema, definirTema: setTema }), [tema]);

  return <TemaContext.Provider value={value}>{children}</TemaContext.Provider>;
}
