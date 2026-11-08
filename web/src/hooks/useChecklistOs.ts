import { useEffect, useMemo, useState } from "react";
import { ITENS_CHECKLIST } from "@/components/orders/steps/ChecklistForm";
import {
  buscarChecklistOs,
  salvarChecklistOs,
  type ItemChecklistOs,
  type StatusChecklist,
} from "@/services/osChecklistService";
import { mensagemDeErro } from "@/utils/apiError";

// junta a lista padrão com o que já foi salvo. se a loja tiver algum item a mais
// cadastrado (que não está na lista padrão), ele entra no fim
function montarItens(salvos: ItemChecklistOs[]): ItemChecklistOs[] {
  const padrao = ITENS_CHECKLIST.map((descricao) => {
    const salvo = salvos.find((item) => item.descricao === descricao);
    return salvo ?? { descricao, status: null, observacao: "" };
  });

  const extras = salvos.filter((item) => !ITENS_CHECKLIST.includes(item.descricao));

  return [...padrao, ...extras];
}

export function useChecklistOs(numOs: number) {
  const [itens, setItens] = useState<ItemChecklistOs[]>(() => montarItens([]));
  const [jaRegistrado, setJaRegistrado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!numOs) return;

    async function carregar() {
      try {
        const salvos = await buscarChecklistOs(numOs);
        setItens(montarItens(salvos));
        setJaRegistrado(salvos.length > 0);
      } catch (error) {
        setErro(mensagemDeErro(error, "Não foi possível carregar o checklist."));
      } finally {
        setCarregando(false);
      }
    }

    void carregar();
  }, [numOs]);

  const contagem = useMemo(
    () => ({
      ok: itens.filter((item) => item.status === "OK").length,
      naoOk: itens.filter((item) => item.status === "NOK").length,
      na: itens.filter((item) => item.status === "NA").length,
      pendentes: itens.filter((item) => item.status === null).length,
    }),
    [itens]
  );

  function marcarStatus(index: number, status: StatusChecklist) {
    setItens((atual) =>
      atual.map((item, i) =>
        // clicar de novo no mesmo status desmarca
        i === index ? { ...item, status: item.status === status ? null : status } : item
      )
    );
  }

  function alterarObservacao(index: number, observacao: string) {
    setItens((atual) => atual.map((item, i) => (i === index ? { ...item, observacao } : item)));
  }

  function marcarTodosOk() {
    setItens((atual) => atual.map((item) => (item.status === null ? { ...item, status: "OK" } : item)));
  }

  async function salvar() {
    setSalvando(true);
    setErro(null);

    try {
      await salvarChecklistOs(numOs, itens);
      setJaRegistrado(itens.some((item) => item.status !== null));
      return true;
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível salvar o checklist."));
      return false;
    } finally {
      setSalvando(false);
    }
  }

  return {
    itens,
    contagem,
    jaRegistrado,
    carregando,
    salvando,
    erro,
    marcarStatus,
    alterarObservacao,
    marcarTodosOk,
    salvar,
  };
}