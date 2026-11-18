import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PainelFinanceiro } from "@/services/financeiroService";
import { formatarMoeda } from "@/utils/moeda";
import { deIso, moedaCompacta } from "@/utils/financeiro";

interface GraficoMesesProps {
  meses: PainelFinanceiro["meses"];
}

interface Ponto {
  mes: string;
  faturamento: number;
  despesas: number;
  lucro: number;
}

const EIXO = { fontSize: 11, fill: "var(--muted-foreground)" };

function nomeDoMes(mes: string, formato: string) {
  return format(deIso(`${mes}-01`), formato, { locale: ptBR });
}

interface DicaProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: unknown }>;
}

function Dica({ active, payload }: DicaProps) {
  const ponto = payload?.[0]?.payload as Ponto | undefined;
  if (!active || !ponto) return null;

  return (
    <div className="min-w-44 rounded-lg border border-border bg-popover px-3 py-2.5 text-sm shadow-md">
      <p className="mb-2 text-xs text-muted-foreground first-letter:uppercase">
        {nomeDoMes(ponto.mes, "MMMM 'de' yyyy")}
      </p>
      <div className="flex justify-between gap-6">
        <span>Faturamento</span>
        <span className="tabular-nums">{formatarMoeda(ponto.faturamento)}</span>
      </div>
      <div className="flex justify-between gap-6 text-muted-foreground">
        <span>Despesas</span>
        <span className="tabular-nums">{formatarMoeda(ponto.despesas)}</span>
      </div>
      <div className="mt-1.5 flex justify-between gap-6 border-t border-border pt-1.5 font-medium">
        <span>Lucro</span>
        <span className={ponto.lucro < 0 ? "text-destructive tabular-nums" : "text-primary tabular-nums"}>
          {formatarMoeda(ponto.lucro)}
        </span>
      </div>
    </div>
  );
}

// colunas = quanto entrou, linha = quanto sobrou. o mês do filtro fica mais escuro
function GraficoMeses({ meses }: GraficoMesesProps) {
  const dados: Ponto[] = meses.map((m) => ({ ...m, lucro: m.faturamento - m.despesas }));
  const ultimo = dados.length - 1;
  const vazio = dados.every((m) => m.faturamento === 0 && m.despesas === 0);

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Faturamento e lucro</h2>
          <p className="text-xs text-muted-foreground">últimos 12 meses</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px] bg-chart-2" /> Faturamento
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3.5 rounded-full bg-primary" /> Lucro
          </span>
        </div>
      </div>

      {vazio ? (
        <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          Ainda não tem movimento nesses 12 meses.
        </p>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dados} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="mes"
                tickFormatter={(valor) => nomeDoMes(String(valor), "MMM")}
                tick={EIXO}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(valor) => moedaCompacta(Number(valor))}
                tick={EIXO}
                tickLine={false}
                axisLine={false}
                width={64}
              />
              <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.6 }} content={(props) => <Dica {...props} />} />
              <Bar dataKey="faturamento" maxBarSize={28} radius={[4, 4, 0, 0]}>
                {dados.map((ponto, indice) => (
                  <Cell key={ponto.mes} fill={indice === ultimo ? "var(--chart-3)" : "var(--chart-1)"} />
                ))}
              </Bar>
              <Line
                dataKey="lucro"
                type="monotone"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: "var(--primary)" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default GraficoMeses;