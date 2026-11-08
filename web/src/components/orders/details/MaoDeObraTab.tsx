import { useState, type FormEvent } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Alert from "@/components/common/Alert";
import SecaoTitulo from "./SecaoTitulo";
import CampoValor from "./CampoValor";
import ItensLancados from "./ItensLancados";
import { lancarItemOs } from "@/services/itemOsService";
import { mensagemDeErro } from "@/utils/apiError";
import { paraNumero } from "@/utils/moeda";
import type { ItemOsInterface } from "@/types/ordemServico";

interface MaoDeObraTabProps {
  numOs: number;
  servicos: ItemOsInterface[];
  bloqueado: boolean;
  onAlterado: () => Promise<void>;
  onRemover: (idItemOs: number) => Promise<void>;
}

function MaoDeObraTab({ numOs, servicos, bloqueado, onAlterado, onRemover }: MaoDeObraTabProps) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const valorNumero = paraNumero(valor);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!descricao.trim() || valorNumero <= 0) return;

    setEnviando(true);
    setErro(null);

    try {
      await lancarItemOs({
        numOs,
        tipo: "SERVICO",
        descricao: descricao.trim(),
        quantidade: 1,
        valorUnitario: valorNumero,
      });

      setDescricao("");
      setValor("");
      await onAlterado();
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível lançar a mão de obra."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {!bloqueado && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
          <SecaoTitulo>Lançar mão de obra</SecaoTitulo>

          <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
            <div className="flex flex-col gap-2">
              <Label htmlFor="descricao-servico">Serviço realizado</Label>
              <Input
                id="descricao-servico"
                maxLength={150}
                placeholder="Ex.: Troca do módulo do Face ID"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
            <CampoValor id="valor-servico" rotulo="Valor" valor={valor} onChange={setValor} />
          </div>

          <Alert mensagem={erro} />

          <Button
            type="submit"
            disabled={enviando || !descricao.trim() || valorNumero <= 0}
            className="h-11 self-end rounded-xl px-5"
          >
            {enviando ? <Loader2 className="animate-spin" /> : <Plus />}
            Adicionar ao orçamento
          </Button>
        </form>
      )}

      <section className="flex flex-col gap-3">
        <SecaoTitulo>Mão de obra lançada</SecaoTitulo>
        <ItensLancados
          itens={servicos}
          vazio="Nenhum serviço lançado nesta O.S."
          podeRemover={!bloqueado}
          onRemover={onRemover}
        />
      </section>
    </div>
  );
}

export default MaoDeObraTab;