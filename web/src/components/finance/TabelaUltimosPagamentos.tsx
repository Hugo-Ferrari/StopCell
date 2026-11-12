import { format } from "date-fns";
import type { FormaPagamento } from "@/services/pagamentoService";
import type { UltimoPagamento } from "@/services/financeiroService";
import { formatarMoeda } from "@/utils/moeda";

const ROTULOS: Record<FormaPagamento, string> = {
  PIX: "Pix",
  CARTAO: "Cartão",
  DINHEIRO: "Dinheiro",
  BOLETO: "Boleto",
};

interface TabelaUltimosPagamentosProps {
  itens: UltimoPagamento[];
}

function TabelaUltimosPagamentos({ itens }: TabelaUltimosPagamentosProps) {
  if (itens.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Nenhum pagamento de O.S. finalizada ainda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="pb-2 pr-3 font-medium">Data</th>
            <th className="pb-2 pr-3 font-medium">O.S.</th>
            <th className="pb-2 pr-3 font-medium">Cliente</th>
            <th className="pb-2 pr-3 font-medium">Forma</th>
            <th className="pb-2 text-right font-medium">Valor</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => (
            <tr key={item.idPagamento} className="border-t border-border">
              <td className="py-2.5 pr-3 tabular-nums text-muted-foreground">
                {item.dtPagamento ? format(new Date(item.dtPagamento), "dd/MM/yyyy HH:mm") : "—"}
              </td>
              <td className="py-2.5 pr-3 font-medium">#{item.numOs}</td>
              <td className="py-2.5 pr-3">{item.nomeCliente || "—"}</td>
              <td className="py-2.5 pr-3">
                {item.formaPagamento ? ROTULOS[item.formaPagamento] : "—"}
              </td>
              <td className="py-2.5 text-right tabular-nums font-medium">
                {formatarMoeda(item.valorPago)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaUltimosPagamentos;
