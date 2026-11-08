import type { ItemOsInterface } from "@/types/ordemServico";
import { paraNumero } from "@/utils/moeda";

export function subtotalItem(item: ItemOsInterface): number {
  return (item.quantidade ?? 1) * paraNumero(item.valorUnitario);
}

export function calcularOrcamento(itens: ItemOsInterface[] = []) {
  const pecas = itens.filter((item) => item.tipo === "PECA");
  const servicos = itens.filter((item) => item.tipo === "SERVICO");

  const totalPecas = pecas.reduce((soma, item) => soma + subtotalItem(item), 0);
  const totalMaoDeObra = servicos.reduce((soma, item) => soma + subtotalItem(item), 0);

  return {
    pecas,
    servicos,
    totalPecas,
    totalMaoDeObra,
    total: totalPecas + totalMaoDeObra,
  };
}