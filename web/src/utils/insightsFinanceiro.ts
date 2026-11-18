import type { PainelFinanceiro, ResumoFinanceiro } from "@/services/financeiroService";
import { formatarMoeda } from "@/utils/moeda";
import { DIAS_SEMANA, porcentagem, TURNOS, variacaoPercentual } from "@/utils/financeiro";

export interface Insight {
  destaque: string;
  texto: string;
}

interface Entrada {
  resumo: ResumoFinanceiro;
  anterior: ResumoFinanceiro;
  painel: PainelFinanceiro;
  rotuloAnterior: string;
}

// cada regra só entra quando tem dado suficiente pra frase fazer sentido.
// melhor mostrar duas frases certas do que seis forçadas
export function gerarInsights({ resumo, anterior, painel, rotuloAnterior }: Entrada): Insight[] {
  const frases: Insight[] = [];

  const varFaturamento = variacaoPercentual(resumo.totalReceitas, anterior.totalReceitas);
  const varDespesas = variacaoPercentual(resumo.totalDespesas, anterior.totalDespesas);

  if (varFaturamento !== null && Math.abs(varFaturamento) >= 10) {
    frases.push({
      destaque: `Faturamento ${varFaturamento > 0 ? "subiu" : "caiu"} ${Math.abs(varFaturamento).toFixed(0)}%`,
      texto: `em relação a ${rotuloAnterior}: de ${formatarMoeda(anterior.totalReceitas)} pra ${formatarMoeda(resumo.totalReceitas)}.`,
    });
  }

  if (varDespesas !== null && varDespesas > 10 && varDespesas - (varFaturamento ?? 0) > 10) {
    frases.push({
      destaque: `Despesas subiram ${varDespesas.toFixed(0)}%`,
      texto:
        varFaturamento === null || varFaturamento <= 0
          ? "e o faturamento não acompanhou. Vale olhar o que entrou de gasto novo."
          : `enquanto o faturamento subiu ${varFaturamento.toFixed(0)}%. O lucro está crescendo menos do que podia.`,
    });
  }

  const topo = painel.servicos.itens[0];
  const fatiaTopo = topo ? porcentagem(topo.total, painel.servicos.totalGeral) : 0;
  if (topo && fatiaTopo >= 15) {
    frases.push({
      destaque: topo.descricao,
      texto: `trouxe ${fatiaTopo}% do que foi cobrado em serviços e peças, em ${topo.quantidadeOs} O.S.`,
    });
  }

  const totalEntradas = painel.movimento.reduce((s, m) => s + m.quantidade, 0);
  const pico = [...painel.movimento].sort((a, b) => b.quantidade - a.quantidade)[0];
  if (pico && totalEntradas >= 10) {
    const dia = DIAS_SEMANA.find((d) => d.valor === pico.diaSemana)?.nome ?? "";
    const turno = TURNOS.find((t) => t.valor === pico.turno)?.frase ?? "";
    frases.push({
      destaque: `${dia.charAt(0).toUpperCase()}${dia.slice(1)} ${turno}`,
      texto: `concentra ${porcentagem(pico.quantidade, totalEntradas)}% das O.S. abertas no período. Bom horário pra ter técnico na bancada.`,
    });
  }

  const esperandoPeca = painel.parado.find((p) => p.status === "AGUARDANDO_PECA");
  if (esperandoPeca && esperandoPeca.total > 0) {
    frases.push({
      destaque: formatarMoeda(esperandoPeca.total),
      texto: `estão parados em ${esperandoPeca.quantidade} O.S. esperando peça. Cobrar o fornecedor libera esse dinheiro.`,
    });
  }

  const { atendidos, recorrentes } = painel.clientes;
  if (atendidos >= 5 && recorrentes > 0) {
    frases.push({
      destaque: `${porcentagem(recorrentes, atendidos)}% dos clientes`,
      texto: `atendidos no período já têm mais de uma O.S. na loja. É gente que voltou.`,
    });
  }

  const totalMarcas = painel.marcas.reduce((s, m) => s + m.total, 0);
  const marcaTopo = painel.marcas[0];
  if (marcaTopo && painel.marcas.length > 1 && porcentagem(marcaTopo.total, totalMarcas) >= 40) {
    frases.push({
      destaque: marcaTopo.marca,
      texto: `responde por ${porcentagem(marcaTopo.total, totalMarcas)}% do faturamento. Peça dessa marca deve ter prioridade na compra.`,
    });
  }

  return frases.slice(0, 6);
}