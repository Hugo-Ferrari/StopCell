import type { Insight } from "@/utils/insightsFinanceiro";

interface InsightsProps {
  itens: Insight[];
}

function Insights({ itens }: InsightsProps) {
  if (itens.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 font-semibold">O que os números dizem</h2>
      <ul className="grid gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
        {itens.map((item) => (
          <li key={item.destaque} className="border-l-2 border-primary pl-3 text-sm leading-relaxed">
            <span className="font-semibold text-primary">{item.destaque}</span>{" "}
            <span className="text-muted-foreground">{item.texto}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Insights;