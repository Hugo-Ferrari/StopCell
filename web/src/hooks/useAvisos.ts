import { useContext } from "react";
import { AvisosContext } from "@/context/avisosContext";

export function useAvisos() {
  const contexto = useContext(AvisosContext);
  if (!contexto) throw new Error("useAvisos precisa estar dentro do AvisosProvider");
  return contexto;
}
