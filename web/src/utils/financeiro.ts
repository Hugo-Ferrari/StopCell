import { addDays, differenceInCalendarDays, endOfMonth, format, startOfMonth, startOfYear, subDays, subMonths } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { Turno } from "@/services/financeiroService";

export type AtalhoPeriodo = "mes" | "mesPassado" | "30dias" | "ano";

export const ATALHOS: { valor: AtalhoPeriodo; rotulo: string }[] = [
  { valor: "mes", rotulo: "Este mês" },
  { valor: "mesPassado", rotulo: "Mês passado" },
  { valor: "30dias", rotulo: "30 dias" },
  { valor: "ano", rotulo: "Este ano" },
];

// segunda primeiro, que é como a loja pensa a semana
export const DIAS_SEMANA = [
  { valor: 1, curto: "seg", nome: "segunda" },
  { valor: 2, curto: "ter", nome: "terça" },
  { valor: 3, curto: "qua", nome: "quarta" },
  { valor: 4, curto: "qui", nome: "quinta" },
  { valor: 5, curto: "sex", nome: "sexta" },
  { valor: 6, curto: "sáb", nome: "sábado" },
  { valor: 0, curto: "dom", nome: "domingo" },
];

export const TURNOS: { valor: Turno; nome: string; frase: string }[] = [
  { valor: "manha", nome: "manhã", frase: "de manhã" },
  { valor: "tarde", nome: "tarde", frase: "à tarde" },
  { valor: "noite", nome: "noite", frase: "à noite" },
];

export function periodoDoAtalho(atalho: AtalhoPeriodo, hoje = new Date()): DateRange {
  switch (atalho) {
    case "mes":
      return { from: startOfMonth(hoje), to: hoje };
    case "mesPassado": {
      const passado = subMonths(hoje, 1);
      return { from: startOfMonth(passado), to: endOfMonth(passado) };
    }
    case "30dias":
      return { from: subDays(hoje, 29), to: hoje };
    case "ano":
      return { from: startOfYear(hoje), to: hoje };
  }
}

export function iso(data: Date) {
  return format(data, "yyyy-MM-dd");
}

// meio-dia pra não escorregar de dia por causa do fuso
export function deIso(texto: string) {
  return new Date(`${texto}T12:00:00`);
}

// mesmo tamanho, logo antes: 01/11 a 15/11 compara com 17/10 a 31/10
export function periodoAnterior(inicio: string, fim: string) {
  const dias = differenceInCalendarDays(deIso(fim), deIso(inicio)) + 1;
  const fimAnterior = subDays(deIso(inicio), 1);
  return { inicio: iso(addDays(fimAnterior, -(dias - 1))), fim: iso(fimAnterior) };
}

// null quando não dá pra comparar (período anterior zerado)
export function variacaoPercentual(atual: number, anterior: number): number | null {
  if (anterior === 0) return null;
  return ((atual - anterior) / Math.abs(anterior)) * 100;
}

// "R$ 1,2 mil" no eixo do gráfico, que não cabe valor cheio
export function moedaCompacta(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(valor);
}

export function formatarDias(dias: number) {
  if (dias < 1) return `${Math.max(1, Math.round(dias * 24))} h`;
  return `${dias.toFixed(1).replace(".", ",")} dias`;
}

export function porcentagem(parte: number, total: number) {
  return total > 0 ? Math.round((parte / total) * 100) : 0;
}