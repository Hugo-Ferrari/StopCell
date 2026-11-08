import { Link } from "react-router-dom";
import { ArrowRight, ClipboardCheck, Loader2, XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import SecaoTitulo from "./SecaoTitulo";
import ChecklistContadores from "@/components/orders/checklist/ChecklistContadores";
import { useChecklistOs } from "@/hooks/useChecklistOs";
import { cn } from "@/lib/utils";

interface ChecklistTabProps {
  numOs: number;
}

// aqui é só o resumo. pra marcar ou mudar algum item o técnico vai pra tela do checklist
function ChecklistTab({ numOs }: ChecklistTabProps) {
  const { itens, contagem, jaRegistrado, carregando } = useChecklistOs(numOs);
  const comProblema = itens.filter((item) => item.status === "NOK");

  if (carregando) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Carregando checklist...
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {jaRegistrado ? (
        <>
          <ChecklistContadores contagem={contagem} />

          {comProblema.length > 0 && (
            <section className="flex flex-col gap-3">
              <SecaoTitulo>Itens com problema na entrada</SecaoTitulo>
              <ul className="flex flex-col gap-2">
                {comProblema.map((item) => (
                  <li
                    key={item.descricao}
                    className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3"
                  >
                    <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.descricao}</span>
                      {item.observacao && (
                        <span className="text-sm text-muted-foreground">{item.observacao}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-10 text-center">
          <ClipboardCheck className="size-8 text-muted-foreground" />
          <p className="font-medium">O checklist de entrada ainda não foi preenchido</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Registre o estado do aparelho na chegada. Isso protege a loja se o cliente reclamar de algo depois.
          </p>
        </div>
      )}

      <Link
        to={`/ordemServico/${numOs}/checklist`}
        className={cn(buttonVariants({ variant: "outline" }), "h-11 self-end rounded-xl px-5")}
      >
        {jaRegistrado ? "Ver checklist completo" : "Preencher checklist"}
        <ArrowRight />
      </Link>
    </div>
  );
}

export default ChecklistTab;