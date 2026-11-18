import { useEffect } from "react";
import { useAvisos } from "@/hooks/useAvisos";

interface AuthAlertProps {
  mensagem?: string | null;
  tipo?: "erro" | "sucesso" | "aviso";
}

function AuthAlert({ mensagem, tipo = "erro" }: AuthAlertProps) {
  const { mostrar } = useAvisos();

  useEffect(() => {
    if (mensagem) mostrar(mensagem, tipo);
  }, [mensagem, tipo, mostrar]);

  return null;
}

export default AuthAlert;
