import { useContext } from "react";
import { UsuarioContext } from "@/context/usuarioContext";

export function useUsuario() {
  const ctx = useContext(UsuarioContext);
  if (!ctx) {
    throw new Error("useUsuario precisa estar dentro do <UsuarioProvider> (MainLayout)");
  }
  return ctx;
}