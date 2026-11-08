import { Prisma } from '@prisma/client';

type Valor = Prisma.Decimal | number | string | null | undefined;

export function subtotal(quantidade: number | null | undefined, valorUnitario: Valor) {
  return new Prisma.Decimal(valorUnitario ?? 0).times(quantidade ?? 1);
}

// se a O.S. já recebeu R$ 200 e tirar um item deixa o total em R$ 150,
// o pago fica maior que o total. aí só com estorno
export function remocaoDeixaPagoMaiorQueTotal(totalAtual: Valor, subtotalItem: Valor, totalPago: Valor) {
  const novoTotal = new Prisma.Decimal(totalAtual ?? 0).minus(subtotalItem ?? 0);
  return new Prisma.Decimal(totalPago ?? 0).greaterThan(novoTotal);
}