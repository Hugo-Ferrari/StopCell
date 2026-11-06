import { useContext } from "react";
import { TemaContext } from "@/context/temaContext";

export function useTema() {
  const ctx = useContext(TemaContext);
  if (!ctx) {
    throw new Error("useTema precisa estar dentro do <TemaProvider> (main.tsx)");
  }
  return ctx;
}
