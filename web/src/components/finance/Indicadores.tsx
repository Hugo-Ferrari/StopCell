import {
  BanknoteArrowUp,
  Percent,
  ReceiptText,
  Timer,
  TrendingDown,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { PainelFinanceiro, ResumoFinanceiro } from "@/services/financeiroService";
import { formatarMoeda } from "@/utils/moeda";
import { formatarDias, variacaoPercentual } from "@/utils/financeiro";
import { cn } from "@/lib/utils";
import Variacao from "./Variacao";

interface IndicadoresProps {
  resumo: ResumoFinanceiro;
  anterior: ResumoFinanceiro;
  tempoReparo: PainelFinanceiro["tempoReparo"];
}

interface Indicador {
  rotulo: string;
  valor: string;
  detalhe?: string;
  icone: LucideIcon;
  // classes do quadradinho do ícone
  corIcone: string;
  negativo?: boolean;
  variacao: ReactNode;
}

function margem(r: ResumoFinanceiro) {
  return r.totalReceitas > 0 ? (r.saldo / r.totalReceitas) * 100 : null;
}

function ticket(r: ResumoFinanceiro) {
  return r.quantidadeOsFinalizadas > 0 ? r.totalReceitas / r.quantidadeOsFinalizadas : 0;
}

const emPorcento = (v: number) => `${v.toFixed(0)}%`;
const emPontos = (v: number) => `${v.toFixed(1).replace(".", ",")} pts`;

// verde e vermelho só no que entrou e saiu, o resto fica neutro pra não virar arco-íris
const NEUTRO = "bg-muted text-muted-foreground";

function Indicadores({ resumo, anterior, tempoReparo }: IndicadoresProps) {
  const margemAtual = margem(resumo);
  const margemAnterior = margem(anterior);

  const itens: Indicador[] = [
    {
      rotulo: "Entrou",
      valor: formatarMoeda(resumo.totalReceitas),
      detalhe: `${resumo.quantidadeOsFinalizadas} O.S. finalizada${resumo.quantidadeOsFinalizadas === 1 ? "" : "s"}`,
      icone: BanknoteArrowUp,
      corIcone: "bg-success/12 text-success",
      variacao: <Variacao delta={variacaoPercentual(resumo.totalReceitas, anterior.totalReceitas)} formatar={emPorcento} />,
    },
    {
      rotulo: "Saiu",
      valor: formatarMoeda(resumo.totalDespesas),
      detalhe: `${resumo.quantidadeDespesas} despesa${resumo.quantidadeDespesas === 1 ? "" : "s"}`,
      icone: TrendingDown,
      corIcone: "bg-destructive/12 text-destructive",
      variacao: (
        <Variacao
          delta={variacaoPercentual(resumo.totalDespesas, anterior.totalDespesas)}
          formatar={emPorcento}
          subirEhBom={false}
        />
      ),
    },
    {
      rotulo: "Lucro",
      valor: formatarMoeda(resumo.saldo),
      detalhe: "entrou menos saiu",
      icone: Wallet,
      corIcone: "bg-primary/12 text-primary",
      negativo: resumo.saldo < 0,
      variacao: <Variacao delta={variacaoPercentual(resumo.saldo, anterior.saldo)} formatar={emPorcento} />,
    },
    {
      rotulo: "Margem",
      valor: margemAtual === null ? "—" : `${margemAtual.toFixed(0)}%`,
      detalhe: "do que entrou, sobrou",
      icone: Percent,
      corIcone: NEUTRO,
      variacao: (
        <Variacao
          delta={margemAtual !== null && margemAnterior !== null ? margemAtual - margemAnterior : null}
          formatar={emPontos}
        />
      ),
    },
    {
      rotulo: "Ticket médio",
      valor: formatarMoeda(ticket(resumo)),
      detalhe: "por O.S.",
      icone: ReceiptText,
      corIcone: NEUTRO,
      variacao: <Variacao delta={variacaoPercentual(ticket(resumo), ticket(anterior))} formatar={emPorcento} />,
    },
    {
      rotulo: "Tempo de reparo",
      valor: tempoReparo.atual === null ? "—" : formatarDias(tempoReparo.atual),
      detalhe: "da entrada até a entrega",
      icone: Timer,
      corIcone: NEUTRO,
      variacao: (
        <Variacao
          delta={tempoReparo.atual !== null && tempoReparo.anterior !== null ? tempoReparo.atual - tempoReparo.anterior : null}
          formatar={formatarDias}
          subirEhBom={false}
        />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {itens.map((item) => {
        const Icone = item.icone;
        return (
          <div key={item.rotulo} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2.5">
              <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", item.corIcone)}>
                <Icone className="size-[18px]" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight">{item.rotulo}</p>
                {item.detalhe && <p className="truncate text-[11px] text-muted-foreground">{item.detalhe}</p>}
              </div>
            </div>

            <span
              className={cn(
                "text-xl font-semibold tracking-tight tabular-nums xl:text-[22px]",
                item.negativo && "text-destructive",
              )}
            >
              {item.valor}
            </span>

            <div className="mt-auto">{item.variacao}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Indicadores;