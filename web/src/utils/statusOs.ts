import type { StatusOs } from "@/types/ordemServico";

interface EstiloStatus {
  label: string;
  bg: string;
  text: string;
  dot: string;
}

// único lugar com nome e cor de cada status. lista, histórico, detalhe e filtro
// leem daqui, então mudar uma cor aqui muda no sistema todo
export const STATUS_OS: Record<StatusOs, EstiloStatus> = {
  ABERTA: {
    label: "Aberta",
    bg: "bg-muted border-border",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  DIAGNOSTICO: {
    label: "Em Diagnóstico",
    bg: "bg-yellow-500/10 border-yellow-500/30",
    text: "text-yellow-700 dark:text-yellow-500",
    dot: "bg-yellow-500",
  },
  EM_APROVACAO: {
    label: "Em Aprovação",
    bg: "bg-sky-500/10 border-sky-500/30",
    text: "text-sky-700 dark:text-sky-400",
    dot: "bg-sky-500",
  },
  EM_REPARO: {
    label: "Em Reparo",
    bg: "bg-blue-500/10 border-blue-500/30",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  AGUARDANDO_PECA: {
    label: "Aguardando Peça",
    bg: "bg-orange-500/10 border-orange-500/30",
    text: "text-orange-700 dark:text-orange-400",
    dot: "bg-orange-500",
  },
  FINALIZADO: {
    label: "Finalizado",
    bg: "bg-green-500/10 border-green-500/30",
    text: "text-green-700 dark:text-green-500",
    dot: "bg-green-500",
  },
  CANCELADO: {
    label: "Cancelado",
    bg: "bg-muted border-border",
    text: "text-muted-foreground line-through",
    dot: "bg-zinc-500",
  },
};

// ordem do fluxo, usada pra montar o filtro
export const ORDEM_STATUS: StatusOs[] = [
  "ABERTA",
  "DIAGNOSTICO",
  "EM_APROVACAO",
  "EM_REPARO",
  "AGUARDANDO_PECA",
  "FINALIZADO",
  "CANCELADO",
];

// O.S. fechada não recebe mais item. o back também bloqueia, isso aqui é só pra esconder o formulário
export function estaEncerrada(status: StatusOs) {
  return status === "FINALIZADO" || status === "CANCELADO";
}

export function estiloStatus(status: StatusOs): EstiloStatus {
  // se vier algo que o front não conhece, mostra neutro em vez de quebrar a tela
  return STATUS_OS[status] ?? STATUS_OS.ABERTA;
}