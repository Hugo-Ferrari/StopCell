import { useCallback, useEffect, useState } from "react";
import { listarAparelhosDoCliente, type AparelhoDoCliente } from "@/services/deviceService";
import { mensagemDeErro } from "@/utils/apiError";

export function useAparelhosDoCliente(cpf: string) {
  const [aparelhos, setAparelhos] = useState<AparelhoDoCliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setAparelhos(await listarAparelhosDoCliente(cpf));
      setErro(null);
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível carregar os aparelhos do cliente."));
    } finally {
      setCarregando(false);
    }
  }, [cpf]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  return { aparelhos, carregando, erro, recarregar: carregar };
}