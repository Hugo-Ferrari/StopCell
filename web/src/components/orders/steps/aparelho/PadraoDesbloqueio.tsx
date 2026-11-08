import { useState } from "react";
import { cn } from "@/lib/utils";

interface PadraoDesbloqueioProps {
  valor: string;
  onChange: (valor: string) => void;
}

const PONTOS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

// senha de desenho: o técnico arrasta pelos pontos ou digita a sequência
function PadraoDesbloqueio({ valor, onChange }: PadraoDesbloqueioProps) {
  const [desenhando, setDesenhando] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-background p-5 md:col-span-2 md:flex-row">
      <div
        className="grid shrink-0 touch-none grid-cols-3 gap-3 rounded-xl border border-border bg-card p-4"
        onPointerUp={() => setDesenhando(false)}
        onPointerLeave={() => setDesenhando(false)}
      >
        {PONTOS.map((ponto) => {
          const ativo = valor.includes(ponto);

          return (
            <div
              key={ponto}
              onPointerDown={(e) => {
                // solta o "capture" do toque pra os outros pontos receberem o onPointerEnter
                e.currentTarget.releasePointerCapture(e.pointerId);
                setDesenhando(true);
                onChange(ponto);
              }}
              onPointerEnter={() => {
                if (desenhando && !valor.includes(ponto)) onChange(valor + ponto);
              }}
              className={cn(
                "flex size-10 cursor-pointer select-none items-center justify-center rounded-full text-sm font-bold transition-all duration-200",
                ativo
                  ? "scale-110 bg-primary text-primary-foreground shadow-[0_0_12px_rgba(242,92,56,0.6)]"
                  : "border-2 border-border text-muted-foreground hover:border-muted-foreground",
              )}
            >
              {ponto}
            </div>
          );
        })}
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="flex items-end justify-between">
          <label htmlFor="padrao" className="text-xs font-bold text-primary md:text-sm">
            Sequência do desenho
          </label>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            Limpar
          </button>
        </div>
        <p className="mb-1 text-xs text-muted-foreground">Deslize pelas bolinhas ou digite a sequência.</p>
        <input
          id="padrao"
          type="text"
          inputMode="numeric"
          value={valor}
          onChange={(e) => {
            const apenasPontos = e.target.value.replace(/[^1-9]/g, "");
            onChange(Array.from(new Set(apenasPontos)).join(""));
          }}
          placeholder="Ex: 14789"
          className="w-full rounded-xl border border-primary/30 bg-primary/10 p-4 text-center font-bold tracking-[0.5em] text-foreground outline-none transition-colors focus:border-primary"
        />
      </div>
    </div>
  );
}

export default PadraoDesbloqueio;