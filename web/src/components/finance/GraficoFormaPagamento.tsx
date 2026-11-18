import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { FormaPagamento } from "@/services/pagamentoService";
import { formatarMoeda } from "@/utils/moeda";
import { porcentagem } from "@/utils/financeiro";

const FORMAS: Record<FormaPagamento, { rotulo: string; cor: string }> = {
  PIX: { rotulo: "Pix", cor: "var(--primary)" },
  CARTAO: { rotulo: "Cartão", cor: "var(--chart-3)" },
  DINHEIRO: { rotulo: "Dinheiro", cor: "var(--success)" },
  BOLETO: { rotulo: "Boleto", cor: "var(--chart-1)" },
};

interface Fatia {
  name: string;
  value: number;
  cor: string;
}

interface GraficoFormaPagamentoProps {
  itens: { formaPagamento: FormaPagamento; total: number }[];
}

interface DicaProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: unknown }>;
  total: number;
}

function Dica({ active, payload, total }: DicaProps) {
  const fatia = payload?.[0]?.payload as Fatia | undefined;
  if (!active || !fatia) return null;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="flex items-center gap-2">
        <span className="size-2.5 rounded-[3px]" style={{ background: fatia.cor }} />
        {fatia.name}
        <span className="text-muted-foreground tabular-nums">{porcentagem(fatia.value, total)}%</span>
      </p>
      <p className="mt-0.5 font-medium tabular-nums">{formatarMoeda(fatia.value)}</p>
    </div>
  );
}

function GraficoFormaPagamento({ itens }: GraficoFormaPagamentoProps) {
  const dados: Fatia[] = itens
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total)
    .map((item) => ({
      name: FORMAS[item.formaPagamento]?.rotulo ?? item.formaPagamento,
      value: item.total,
      cor: FORMAS[item.formaPagamento]?.cor ?? "var(--muted-foreground)",
    }));

  const total = dados.reduce((soma, item) => soma + item.value, 0);

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 md:p-6">
      <div>
        <h2 className="font-semibold">Como pagaram</h2>
        <p className="text-xs text-muted-foreground">entradas por forma de pagamento</p>
      </div>

      {dados.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Nenhum pagamento no período.</p>
      ) : (
        <>
          <div className="relative h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dados}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="70%"
                  outerRadius="100%"
                  paddingAngle={2}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {dados.map((fatia) => (
                    <Cell key={fatia.name} fill={fatia.cor} />
                  ))}
                </Pie>
                <Tooltip content={(props) => <Dica {...props} total={total} />} />
              </PieChart>
            </ResponsiveContainer>

            {/* total no meio da rosca */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[11px] text-muted-foreground">Total</span>
              <span className="text-base font-semibold tabular-nums">{formatarMoeda(total)}</span>
            </div>
          </div>

          <ul className="flex flex-col gap-2.5">
            {dados.map((fatia) => {
              const pct = porcentagem(fatia.value, total);
              return (
                <li key={fatia.name} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="size-2.5 rounded-[3px]" style={{ background: fatia.cor }} />
                      {fatia.name}
                    </span>
                    <span className="tabular-nums">
                      <span className="font-medium">{formatarMoeda(fatia.value)}</span>
                      <span className="ml-2 inline-block w-9 text-right text-xs text-muted-foreground">{pct}%</span>
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: fatia.cor }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}

export default GraficoFormaPagamento;