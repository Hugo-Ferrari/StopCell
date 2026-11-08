import type { OrdemServicoResumo, StatusOs } from "@/types/ordemServico";
import { ORDEM_STATUS, STATUS_OS } from "@/utils/statusOs";

// retrabalho não é um status: é a O.S. que nasceu de outra (tem numOsAnterior).
// mesmo assim entra no filtro, porque é o que a loja mais quer achar rápido
export type FiltroOs = StatusOs | "RETRABALHO";

export interface OpcaoFiltro {
  valor: FiltroOs;
  rotulo: string;
  cor: string;
}

// a ordem segue o fluxo da O.S., com retrabalho antes de finalizado/cancelado
const opcoesDeStatus: OpcaoFiltro[] = ORDEM_STATUS.map((status) => ({
  valor: status,
  rotulo: STATUS_OS[status].label,
  cor: STATUS_OS[status].dot,
}));

export const OPCOES_FILTRO: OpcaoFiltro[] = [
  ...opcoesDeStatus.slice(0, 5),
  { valor: "RETRABALHO", rotulo: "Retrabalho", cor: "bg-red-500" },
  ...opcoesDeStatus.slice(5),
];

export function atendeFiltro(ordem: OrdemServicoResumo, filtro: FiltroOs) {
  if (filtro === "RETRABALHO") return ordem.numOsAnterior != null;
  return ordem.status === filtro;
}

export function contarPorFiltro(ordens: OrdemServicoResumo[]) {
  const contagem = {} as Record<FiltroOs, number>;

  for (const opcao of OPCOES_FILTRO) {
    contagem[opcao.valor] = ordens.filter((ordem) => atendeFiltro(ordem, opcao.valor)).length;
  }

  return contagem;
}

// sem nada marcado mostra tudo. marcando mais de um, mostra quem bater em qualquer um
export function filtrarOrdens(ordens: OrdemServicoResumo[], filtros: FiltroOs[], busca: string) {
  const termo = busca.trim().toLowerCase();

  return ordens.filter((ordem) => {
    const passaFiltro = filtros.length === 0 || filtros.some((filtro) => atendeFiltro(ordem, filtro));
    if (!passaFiltro) return false;
    if (!termo) return true;

    return (
      ordem.numOs.toString().includes(termo) ||
      ordem.cliente?.nmCompleto?.toLowerCase().includes(termo) ||
      ordem.aparelho?.modelo?.toLowerCase().includes(termo) ||
      ordem.imeiAparelho?.includes(termo)
    );
  });
}