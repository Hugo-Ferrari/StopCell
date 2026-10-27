"use client ";
import type { PecaDTO } from "@/services/pecaService";

type Props = {
  peca: PecaDTO[];
};
function FilterStock({ peca }: Props) {
  return (
    <div className="w-full rounded-xl bg-card p-5">
      <div className="grid grid-cols-2 border-b border-border px-4 py-3 text-sm font-medium text-muted-foreground">
        <span>Peça</span>
        <span className="text-right">Valor</span>
      </div>
      <div>
        {peca.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Nenhuma peça encontrada.
          </div>
        ) : (
          peca.map((peca) => (
            <div
              key={peca.idPeca}
              className="grid grid-cols-2 items-center border-b border-border px-4 py-4 last:border-0"
            >
              <div>
                <p className="font-medium">{peca.descricao}</p>

                <p className="text-xs text-muted-foreground">
                  Código: {peca.idPeca}
                </p>
              </div>

              <div className="text-right">
                <span className="font-semibold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(peca.valor)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FilterStock;
