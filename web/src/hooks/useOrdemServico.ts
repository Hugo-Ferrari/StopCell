import { useCallback, useEffect, useState } from "react";
import { buscarOrdemServicoPorNumero } from "@/services/serviceOrderService";
import { mensagemDeErro } from "@/utils/apiError";
import type { OrdemDetalheInterface } from "@/types/ordemServico";

export function useOrdemServico(numOs: number) {
  const [ordem, setOrdem] = useState<OrdemDetalheInterface | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    if (!numOs) return;

    return buscarOrdemServicoPorNumero(numOs)
      .then((dados) => {
        setOrdem(dados);
        setErro(null);
      })
      .catch((error) => setErro(mensagemDeErro(error, "Não foi possível carregar a ordem de serviço.")))
      .finally(() => setCarregando(false));
  }, [numOs]);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  return { ordem, carregando, erro, recarregar };
}
