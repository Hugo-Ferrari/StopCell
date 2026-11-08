import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ClipboardCheck, Package, Stethoscope, Wrench } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import Alert from "@/components/common/Alert";
import PrintOsButton from "@/components/orders/PrintOsButton";
import OsResumoCard from "@/components/orders/details/OsResumoCard";
import DiagnosticoTab from "@/components/orders/details/DiagnosticoTab";
import MaoDeObraTab from "@/components/orders/details/MaoDeObraTab";
import PecasTab from "@/components/orders/details/PecasTab";
import ChecklistTab from "@/components/orders/details/ChecklistTab";
import OrcamentoResumo from "@/components/orders/details/OrcamentoResumo";
import AcoesStatus from "@/components/orders/details/AcoesStatus";
import AvisosCliente from "@/components/orders/details/AvisosCliente";
import DetalhesSkeleton from "@/components/orders/details/DetalhesSkeleton";
import { useOrdemServico } from "@/hooks/useOrdemServico";
import { removerItemOs } from "@/services/itemOsService";
import { mensagemDeErro } from "@/utils/apiError";
import { calcularOrcamento } from "@/utils/orcamento";
import { estaEncerrada } from "@/utils/statusOs";
import { cn } from "@/lib/utils";

type Aba = "diagnostico" | "reparo" | "pecas" | "checklist";

function Contador({ valor }: { valor: number }) {
  if (valor === 0) return null;
  return (
    <span className="rounded-full bg-primary/15 px-1.5 text-[11px] font-bold text-primary tabular-nums">{valor}</span>
  );
}

function DetalhesOrdemServico() {
  const { numOs } = useParams();
  const numero = Number(numOs);

  const { ordem, carregando, erro, recarregar } = useOrdemServico(numero);
  const [aba, setAba] = useState<Aba>("diagnostico");
  const [erroRemocao, setErroRemocao] = useState<string | null>(null);

  async function handleRemoverItem(idItemOs: number) {
    setErroRemocao(null);
    try {
      await removerItemOs(idItemOs);
      await recarregar();
    } catch (error) {
      setErroRemocao(mensagemDeErro(error, "Não foi possível remover o item."));
    }
  }

  if (carregando) return <DetalhesSkeleton />;

  if (!ordem) {
    return (
      <div className="flex flex-col items-start gap-4">
        <Alert mensagem={erro ?? "Ordem de serviço não encontrada."} />
        <Link to="/ordemServico" className={cn(buttonVariants({ variant: "outline" }), "h-10 rounded-xl px-4")}>
          <ArrowLeft /> Voltar para as ordens
        </Link>
      </div>
    );
  }

  const orcamento = calcularOrcamento(ordem.itensOs);
  // finalizada ou cancelada: só leitura
  const encerrada = estaEncerrada(ordem.status);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-0">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/ordemServico"
          className={cn(buttonVariants({ variant: "ghost" }), "h-10 rounded-xl px-3 text-muted-foreground")}
        >
          <ArrowLeft /> Ordens de serviço
        </Link>
        <PrintOsButton numOs={ordem.numOs} />
      </div>

      <OsResumoCard ordem={ordem} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Tabs value={aba} onValueChange={(valor) => setAba(valor as Aba)}>
          <TabsList className="overflow-x-auto">
            <TabsTrigger value="diagnostico">
              <Stethoscope /> Diagnóstico
            </TabsTrigger>
            <TabsTrigger value="reparo">
              <Wrench /> Reparo <Contador valor={orcamento.servicos.length} />
            </TabsTrigger>
            <TabsTrigger value="pecas">
              <Package /> Peças <Contador valor={orcamento.pecas.length} />
            </TabsTrigger>
            <TabsTrigger value="checklist">
              <ClipboardCheck /> Checklist
            </TabsTrigger>
          </TabsList>

          <Alert mensagem={erroRemocao} />

          <TabsContent value="diagnostico">
            <DiagnosticoTab
              numOs={ordem.numOs}
              relatoCliente={ordem.diagnostico}
              diagnosticos={ordem.diagnosticos ?? []}
              onSalvo={recarregar}
            />
          </TabsContent>

          <TabsContent value="reparo">
            <MaoDeObraTab
              numOs={ordem.numOs}
              servicos={orcamento.servicos}
              bloqueado={encerrada}
              onAlterado={recarregar}
              onRemover={handleRemoverItem}
            />
          </TabsContent>

          <TabsContent value="pecas">
            <PecasTab
              numOs={ordem.numOs}
              pecas={orcamento.pecas}
              bloqueado={encerrada}
              onAlterado={recarregar}
              onRemover={handleRemoverItem}
            />
          </TabsContent>

          <TabsContent value="checklist">
            <ChecklistTab numOs={ordem.numOs} />
          </TabsContent>
        </Tabs>

        {/* no desktop o orçamento fica parado do lado enquanto o técnico troca de aba */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-28">
          <OrcamentoResumo
            totalPecas={orcamento.totalPecas}
            totalMaoDeObra={orcamento.totalMaoDeObra}
            total={orcamento.total}
          />
          <AcoesStatus numOs={ordem.numOs} status={ordem.status} total={orcamento.total} onAlterado={recarregar} />
          <AvisosCliente avisos={ordem.logNotificacoes ?? []} />
        </aside>
      </div>
    </div>
  );
}

export default DetalhesOrdemServico;