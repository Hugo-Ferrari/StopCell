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
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // trocando o período rápido, uma resposta antiga pode chegar depois da nova.
  // cada busca ganha um número e só a última grava na tela
  const ultimaBusca = useRef(0);

  const carregar = useCallback(async () => {
    const estaBusca = ++ultimaBusca.current;
    const params = { inicio, fim };
    setCarregando(true);

    try {
      const [resumo, resumoAnterior, painel, formas, despesas, recebimentos] = await Promise.all([
        buscarResumo(params),
        buscarResumo(periodoAnterior(inicio, fim)),
        buscarPainel(params),
        buscarReceitasPorForma(params),
        listarDespesas(params),
        buscarRecebimentos(params),
      ]);

      if (estaBusca !== ultimaBusca.current) return;

      setDados({ resumo, resumoAnterior, painel, formas, despesas, recebimentos });
      setErro(null);
    } catch (error) {
      if (estaBusca !== ultimaBusca.current) return;
      setErro(mensagemDeErro(error, "Não foi possível carregar o financeiro."));
    } finally {
      if (estaBusca === ultimaBusca.current) setCarregando(false);
    }
  }, [fim, inicio]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  return { dados, carregando, erro, recarregar: carregar };
}