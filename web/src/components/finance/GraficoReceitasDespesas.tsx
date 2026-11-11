import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AgruparPeriodo } from "@/services/financeiroService";
import { formatarMoeda } from "@/utils/moeda";

interface GraficoReceitasDespesasProps {
  dados: { periodo: string; receitas: number; despesas: number }[];
  agrupar: AgruparPeriodo;
}

function rotuloPeriodo(periodo: string, agrupar: AgruparPeriodo) {
  if (agrupar === "mes") {
    const [ano, mes] = periodo.split("-");
    return `${mes}/${ano}`;
  }
  const [, mes, dia] = periodo.split("-");
  return `${dia}/${mes}`;
}

function GraficoReceitasDespesas({ dados, agrupar }: GraficoReceitasDespesasProps) {
  if (dados.every((item) => item.receitas === 0 && item.despesas === 0)) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Sem receitas ou despesas neste período.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dados} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="periodo"
            tickFormatter={(valor) => rotuloPeriodo(String(valor), agrupar)}
            tick={{ fontSize: 12 }}
          />
          <YAxis tickFormatter={(valor) => formatarMoeda(Number(valor))} width={80} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(valor) => formatarMoeda(Number(valor ?? 0))}
            labelFormatter={(label) => rotuloPeriodo(String(label), agrupar)}
          />
          <Legend />
          <Bar dataKey="receitas" name="Receitas" fill="var(--success)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="despesas" name="Despesas" fill="var(--destructive)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoReceitasDespesas;
