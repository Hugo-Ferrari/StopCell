import type { OrdemServicoResumo } from "@/types/ordemServico";

export interface GrupoHistorico {
  chave: string;
  ultimaOs: OrdemServicoResumo;
  totalServicos: number;
}

// As ordens chegam da API da mais recente para a mais antiga,
// então a primeira de cada grupo é a última OS daquele cliente/aparelho.
function agrupar(
  ordens: OrdemServicoResumo[],
  getChave: (os: OrdemServicoResumo) => string
): GrupoHistorico[] {
  const grupos = new Map<string, GrupoHistorico>();

  for (const os of ordens) {
    const chave = getChave(os);
    const grupo = grupos.get(chave);
    if (grupo) {
      grupo.totalServicos++;
    } else {
      grupos.set(chave, { chave, ultimaOs: os, totalServicos: 1 });
    }
  }

  return Array.from(grupos.values());
}

export function agruparPorCliente(ordens: OrdemServicoResumo[]) {
  return agrupar(ordens, (os) => os.cpfCliente);
}

export function agruparPorAparelho(ordens: OrdemServicoResumo[]) {
  return agrupar(ordens, (os) => os.imeiAparelho);
}
