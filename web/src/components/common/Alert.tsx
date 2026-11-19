import { useEffect } from "react";
import { useAvisos } from "@/hooks/useAvisos";

interface AlertProps {
  mensagem?: string | null;
  tipo?: "erro" | "sucesso";
}

function Alert({ mensagem, tipo = "erro" }: AlertProps) {
  const { mostrar } = useAvisos();

  useEffect(() => {
    if (mensagem) mostrar(mensagem, tipo);
  }, [mensagem, tipo, mostrar]);

  return null;
}

export default Alert;
