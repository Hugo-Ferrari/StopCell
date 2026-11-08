import { useCallback, useEffect, useState } from "react";
import { listarOs } from "@/services/serviceOrderService";
import { mensagemDeErro } from "@/utils/apiError";
import type { OrdemServicoResumo } from "@/types/ordemServico";

export function useListaOrdens() {
  const [ordens, setOrdens] = useState<OrdemServicoResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setOrdens(await listarOs());
      setErro(null);
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível carregar as ordens de serviço."));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  return { ordens, carregando, erro, recarregar: carregar };
}