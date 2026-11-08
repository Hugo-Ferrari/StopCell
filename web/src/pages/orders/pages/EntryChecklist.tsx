import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCheck, Loader2, Save } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Alert from "@/components/common/Alert";
import OsResumoCard from "@/components/orders/details/OsResumoCard";
import DetalhesSkeleton from "@/components/orders/details/DetalhesSkeleton";
import ChecklistContadores from "@/components/orders/checklist/ChecklistContadores";
import ChecklistItemRow from "@/components/orders/checklist/ChecklistItemRow";
import { useOrdemServico } from "@/hooks/useOrdemServico";
import { useChecklistOs } from "@/hooks/useChecklistOs";
import { cn } from "@/lib/utils";

function ChecklistEntrada() {
  const { numOs } = useParams();
  const numero = Number(numOs);

  const { ordem, carregando: carregandoOrdem, erro: erroOrdem } = useOrdemServico(numero);
  const checklist = useChecklistOs(numero);
  const [salvo, setSalvo] = useState(false);

  async function handleSalvar() {
    setSalvo(false);
    const deuCerto = await checklist.salvar();
    setSalvo(deuCerto);
  }

  if (carregandoOrdem || checklist.carregando) return <DetalhesSkeleton />;

  if (!ordem) return <Alert mensagem={erroOrdem ?? "Ordem de serviço não encontrada."} />;

  const voltarPara = `/ordemServico/${ordem.numOs}`;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 animate-in fade-in-0">
      <Link
        to={voltarPara}
        className={cn(buttonVariants({ variant: "ghost" }), "h-10 w-fit rounded-xl px-3 text-muted-foreground")}
      >
        <ArrowLeft /> Voltar para a O.S.
      </Link>

      <OsResumoCard ordem={ordem} />

      <ChecklistContadores contagem={checklist.contagem} />

      <Card className="gap-0 py-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
          <div>
            <h2 className="font-semibold">Estado do aparelho na entrada</h2>
            <p className="text-sm text-muted-foreground">
              {checklist.contagem.pendentes > 0
                ? `${checklist.contagem.pendentes} ${checklist.contagem.pendentes === 1 ? "item sem marcar" : "itens sem marcar"}`
                : "Todos os itens marcados"}
            </p>
          </div>

          {checklist.contagem.pendentes > 0 && (
            <Button variant="outline" onClick={checklist.marcarTodosOk} className="h-9 rounded-xl px-3">
              <CheckCheck /> Marcar o resto como OK
            </Button>
          )}
        </div>

        <ul className="divide-y divide-border">
          {checklist.itens.map((item, index) => (
            <ChecklistItemRow
              key={item.descricao}
              item={item}
              onStatus={(status) => {
                setSalvo(false);
                checklist.marcarStatus(index, status);
              }}
              onObservacao={(texto) => {
                setSalvo(false);
                checklist.alterarObservacao(index, texto);
              }}
            />
          ))}
        </ul>
      </Card>

      <Alert mensagem={checklist.erro} />
      <Alert mensagem={salvo ? "Checklist salvo." : null} tipo="sucesso" />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link to={voltarPara} className={cn(buttonVariants({ variant: "outline" }), "h-12 rounded-xl px-5")}>
          Cancelar
        </Link>
        <Button
          onClick={handleSalvar}
          disabled={checklist.salvando || checklist.contagem.pendentes === checklist.itens.length}
          className="h-12 rounded-xl px-6 text-base"
        >
          {checklist.salvando ? <Loader2 className="animate-spin" /> : <Save />}
          Salvar checklist
        </Button>
      </div>
    </div>
  );
}

export default ChecklistEntrada;