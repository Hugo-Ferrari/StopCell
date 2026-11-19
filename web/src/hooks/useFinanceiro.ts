import { useCallback, useEffect, useRef, useState } from "react";
import {
  buscarPainel,
  buscarReceitasPorForma,
  buscarRecebimentos,
  buscarResumo,
  listarDespesas,
  type Despesa,
  type PainelFinanceiro,
  type ReceitasPorForma,
  type Recebimento,
  type ResumoFinanceiro,
} from "@/services/financeiroService";
import { mensagemDeErro } from "@/utils/apiError";
import { periodoAnterior } from "@/utils/financeiro";

export interface DadosFinanceiro {
  resumo: ResumoFinanceiro;
  resumoAnterior: ResumoFinanceiro;
  painel: PainelFinanceiro;
  formas: ReceitasPorForma;
  despesas: Despesa[];
  recebimentos: Recebimento[];
}

export function useFinanceiro(inicio: string, fim: string) {
  const [dados, setDados] = useState<DadosFinanceiro | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const periodo = `${inicio}|${fim}`;
  const [periodoCarregado, setPeriodoCarregado] = useState<string | null>(null);
  const [recarregando, setRecarregando] = useState(false);
  const carregando = periodoCarregado !== periodo || recarregando;

  // trocando o período rápido, uma resposta antiga pode chegar depois da nova.
  // cada busca ganha um número e só a última grava na tela
  const ultimaBusca = useRef(0);

  const buscar = useCallback(() => {
    const estaBusca = ++ultimaBusca.current;
    const params = { inicio, fim };
    const ehAUltima = () => estaBusca === ultimaBusca.current;

    return Promise.all([
      buscarResumo(params),
      buscarResumo(periodoAnterior(inicio, fim)),
      buscarPainel(params),
      buscarReceitasPorForma(params),
      listarDespesas(params),
      buscarRecebimentos(params),
    ])
      .then(([resumo, resumoAnterior, painel, formas, despesas, recebimentos]) => {
        if (!ehAUltima()) return;
        setDados({ resumo, resumoAnterior, painel, formas, despesas, recebimentos });
        setErro(null);
      })
      .catch((error) => {
        if (ehAUltima()) setErro(mensagemDeErro(error, "Não foi possível carregar o financeiro."));
      })
      .finally(() => {
        if (!ehAUltima()) return;
        setPeriodoCarregado(`${inicio}|${fim}`);
        setRecarregando(false);
      });
  }, [fim, inicio]);

  useEffect(() => {
    void buscar();
  }, [buscar]);

  const recarregar = useCallback(() => {
    setRecarregando(true);
    return buscar();
  }, [buscar]);

  return { dados, carregando, erro, recarregar };
}