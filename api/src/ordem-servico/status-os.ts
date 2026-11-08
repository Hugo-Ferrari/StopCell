import type { StatusOs } from '@prisma/client';

export const ROTULO_STATUS: Record<StatusOs, string> = {
  ABERTA: 'Aberta',
  DIAGNOSTICO: 'Em diagnóstico',
  EM_APROVACAO: 'Em aprovação',
  EM_REPARO: 'Em reparo',
  AGUARDANDO_PECA: 'Aguardando peça',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado',
};

// pra onde cada status pode ir. o front tem a mesma ideia em AcoesStatus.tsx
const TRANSICOES: Record<StatusOs, StatusOs[]> = {
  ABERTA: ['DIAGNOSTICO', 'CANCELADO'],
  DIAGNOSTICO: ['EM_APROVACAO', 'CANCELADO'],
  // cliente pode pedir pra rever o orçamento, por isso volta pro diagnóstico
  EM_APROVACAO: ['EM_REPARO', 'DIAGNOSTICO', 'CANCELADO'],
  EM_REPARO: ['AGUARDANDO_PECA', 'FINALIZADO', 'CANCELADO'],
  AGUARDANDO_PECA: ['EM_REPARO', 'CANCELADO'],
  FINALIZADO: [],
  CANCELADO: [],
};

// O.S. fechada não aceita mais item nem remoção de item
export const STATUS_ENCERRADOS: StatusOs[] = ['FINALIZADO', 'CANCELADO'];

export function podeMudarStatus(atual: StatusOs, novo: StatusOs): boolean {
  return TRANSICOES[atual].includes(novo);
}

export function estaEncerrada(status: StatusOs): boolean {
  return STATUS_ENCERRADOS.includes(status);
}