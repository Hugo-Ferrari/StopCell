import { useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import type { Recebimento } from "@/services/financeiroService";
import type { FormaPagamento } from "@/services/pagamentoService";
import { formatarMoeda } from "@/utils/moeda";

const ROTULOS: Record<FormaPagamento, string> = {
  PIX: "Pix",
  CARTAO: "Cartão",
  DINHEIRO: "Dinheiro",
  BOLETO: "Boleto",
};

const POR_VEZ = 8;

interface TabelaUltimosPagamentosProps {
  itens: Recebimento[];
}

// recebimentos do período escolhido, os mais novos primeiro
function TabelaUltimosPagamentos({ itens }: TabelaUltimosPagamentosProps) {
  const [mostrando, setMostrando] = useState(POR_VEZ);
  const total = itens.reduce((s, i) => s + i.valorPago, 0);

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <div>
        <h2 className="font-semibold">Recebimentos</h2>
        <p className="text-sm text-muted-foreground tabular-nums">
          {itens.length > 0 ? `${itens.length} no período · ${formatarMoeda(total)}` : "Pagamentos das O.S. finalizadas"}
        </p>
      </div>

      {itens.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Nenhum recebimento no período.</p>
      ) : (
        <>
          <ul className="-mx-2 flex flex-col">
            {itens.slice(0, mostrando).map((item) => (
              <li key={item.idPagamento}>
                <Link
                  to={`/ordemServico/${item.numOs}`}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm">{item.nomeCliente || "Cliente sem nome"}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      O.S. #{item.numOs}
                      {item.formaPagamento && ` · ${ROTULOS[item.formaPagamento]}`}
                      {item.data && ` · ${format(new Date(item.data), "dd/MM")}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-success tabular-nums">
                    + {formatarMoeda(item.valorPago)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {itens.length > mostrando && (
            <button
              type="button"
              onClick={() => setMostrando((n) => n + POR_VEZ)}
              className="self-center text-sm text-muted-foreground hover:text-foreground"
            >
              Ver mais ({itens.length - mostrando})
            </button>
          )}
        </>
      )}
    </section>
  );
}

export default TabelaUltimosPagamentos;