import { createContext } from "react";

export type Tema = "claro" | "escuro";

export interface TemaContextValue {
  tema: Tema;
  definirTema: (tema: Tema) => void;
}

export const TemaContext = createContext<TemaContextValue | null>(null);
