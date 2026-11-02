import { createContext } from "react";
import type { UsuarioLogado } from "@/services/userService";
import type { Permissao } from "@/utils/permissoes";

export interface UsuarioContextValue {
  usuario: UsuarioLogado | null;
  carregando: boolean;
  ehDono: boolean;
  /** true se o usuário tiver pelo menos UMA das permissões */
  pode: (...permissoes: Permissao[]) => boolean;
  recarregar: () => Promise<void>;
}

export const UsuarioContext = createContext<UsuarioContextValue | null>(null);