import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { FormaPagamento } from "@/services/pagamentoService";
import { formatarMoeda } from "@/utils/moeda";

const ROTULOS: Record<FormaPagamento, string> = {
  PIX: "Pix",
  CARTAO: "Cartão",
  DINHEIRO: "Dinheiro",
  BOLETO: "Boleto",
};

const CORES = ["#D9480F", "#067A46", "#1D6FB8", "#A16207"];

interface GraficoFormaPagamentoProps {
  itens: { formaPagamento: FormaPagamento; total: number }[];
}

function GraficoFormaPagamento({ itens }: GraficoFormaPagamentoProps) {
  const dados = itens
    .filter((item) => item.total > 0)
    .map((item) => ({
      name: ROTULOS[item.formaPagamento] ?? item.formaPagamento,
      value: item.total,
    }));

  if (dados.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Nenhuma receita por forma de pagamento neste período.
      </p>
    );
  }

  return (
    <div className="flex h-72 flex-col items-center gap-4 sm:flex-row">
      <div className="h-full w-full sm:w-1/2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={dados} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
              {dados.map((_, index) => (
                <Cell key={dados[index].name} fill={CORES[index % CORES.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(valor) => formatarMoeda(Number(valor ?? 0))} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex w-full flex-col gap-2 text-sm sm:w-1/2">
        {itens.map((item, index) => (
          <li key={item.formaPagamento} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="size-2.5 rounded-full"
                style={{ background: CORES[index % CORES.length] }}
              />
              {ROTULOS[item.formaPagamento]}
            </span>
            <span className="font-medium tabular-nums">{formatarMoeda(item.total)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GraficoFormaPagamento;
