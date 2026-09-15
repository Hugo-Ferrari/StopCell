"use client ";
import type { PecaDTO } from "@/services/pecaService";
import React, { useState } from "react";

type Props = {
  peca: PecaDTO[];
};
function FilterStock({ peca }: Props) {
  const [filtro, setFiltro] = useState<"todas" | "baixo" | "falta">("todas");

  const pecasFiltradas = peca.filter((peca) => {
    if (filtro === "baixo") {
      return peca.quantidade > 0 && peca.quantidade <= 5;
    }

    if (filtro === "falta") {
      return peca.quantidade === 0;
    }

    return true;
  });

  return (
    <div className="w-full rounded-xl bg-card p-5">

      <div className="mb-5 flex gap-100 rounded-lg bg-muted p-1">
        <button
          onClick={() => setFiltro("todas")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            filtro === "todas"
              ? "bg-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Todas as peças
        </button>

        <button
          onClick={() => setFiltro("baixo")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            filtro === "baixo"
              ? "bg-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Estoque baixo
        </button>

        <button
          onClick={() => setFiltro("falta")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            filtro === "falta"
              ? "bg-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Em falta
        </button>
      </div>
      <div className="grid grid-cols-2 border-b border-border px-4 py-3 text-sm font-medium text-muted-foreground">
        <span>Peça</span>
        <span className="text-right">Quantidade</span>
      </div>
      <div>
        {pecasFiltradas.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Nenhuma peça encontrada.
          </div>
        ) : (
          pecasFiltradas.map((peca) => (
            <div
              key={peca.idPeca}
              className="grid grid-cols-2 items-center border-b border-border px-4 py-4 last:border-0"
            >
              <div>
                <p className="font-medium">
                  {peca.descricao}
                </p>

                <p className="text-xs text-muted-foreground">
                  Código: {peca.idPeca}
                </p>
              </div>

              <div className="text-right">
                <span className="font-semibold">
                  {peca.quantidade}
                </span>

                <p className="text-xs text-muted-foreground">
                  unidades
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FilterStock;
