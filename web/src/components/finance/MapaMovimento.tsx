import type { PainelFinanceiro } from "@/services/financeiroService";
import { DIAS_SEMANA, TURNOS } from "@/utils/financeiro";

interface MapaMovimentoProps {
  movimento: PainelFinanceiro["movimento"];
}

// mapa de calor: quanto mais escuro, mais O.S. entraram naquele dia e turno
function MapaMovimento({ movimento }: MapaMovimentoProps) {
  const quantidade = (dia: number, turno: string) =>
    movimento.find((m) => m.diaSemana === dia && m.turno === turno)?.quantidade ?? 0;

  // domingo só aparece se a loja abriu O.S. em algum domingo
  const dias = DIAS_SEMANA.filter((d) => d.valor !== 0 || movimento.some((m) => m.diaSemana === 0));
  const maior = Math.max(0, ...movimento.map((m) => m.quantidade));
  const total = movimento.reduce((s, m) => s + m.quantidade, 0);

  const pico = [...movimento].sort((a, b) => b.quantidade - a.quantidade)[0];
  const diaPico = pico && DIAS_SEMANA.find((d) => d.valor === pico.diaSemana)?.nome;
  const turnoPico = pico && TURNOS.find((t) => t.valor === pico.turno)?.frase;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 md:p-6">
      <div>
        <h2 className="font-semibold">Dia mais forte</h2>
        <p className="text-xs text-muted-foreground">O.S. abertas por dia e turno</p>
      </div>

      {total === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma O.S. aberta no período.</p>
      ) : (
        <>
          <div
            className="grid items-center gap-1 text-[11px] text-muted-foreground"
            style={{ gridTemplateColumns: `3rem repeat(${dias.length}, minmax(0, 1fr))` }}
          >
            <span />
            {dias.map((dia) => (
              <span key={dia.valor} className="text-center">
                {dia.curto}
              </span>
            ))}

            {TURNOS.map((turno) => (
              <div key={turno.valor} className="contents">
                <span>{turno.nome}</span>
                {dias.map((dia) => {
                  const qtd = quantidade(dia.valor, turno.valor);
                  const forca = maior > 0 ? qtd / maior : 0;
                  return (
                    <div
                      key={dia.valor}
                      title={`${dia.nome} ${turno.frase}: ${qtd} O.S.`}
                      className="h-7 rounded-[4px]"
                      style={{
                        background:
                          qtd === 0
                            ? "var(--muted)"
                            : `color-mix(in oklab, var(--primary) ${Math.round(18 + forca * 82)}%, var(--card))`,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {pico && (
            <p className="text-sm text-muted-foreground">
              Mais movimento: <span className="font-medium text-foreground">{diaPico} {turnoPico}</span>{" "}
              <span className="tabular-nums">({pico.quantidade} O.S.)</span>
            </p>
          )}
        </>
      )}
    </section>
  );
}

export default MapaMovimento;