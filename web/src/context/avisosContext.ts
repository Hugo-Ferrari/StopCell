import { createContext, type ReactNode } from "react";
import type { TipoToast } from "@/components/common/Toast";

export interface AvisosContextValue {
  mostrar: (mensagem: ReactNode, tipo?: TipoToast) => void;
}

export const AvisosContext = createContext<AvisosContextValue | null>(null);
