import { useState, type FormEvent } from "react";
import { Loader2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Alert from "@/components/common/Alert";
import SecaoTitulo from "./SecaoTitulo";
import CampoValor from "./CampoValor";
import ItensLancados from "./ItensLancados";
import { lancarItemOs } from "@/services/itemOsService";
import { mensagemDeErro } from "@/utils/apiError";
import { formatarMoeda, paraNumero } from "@/utils/moeda";
import type { ItemOsInterface } from "@/types/ordemServico";

interface PecasTabProps {
  numOs: number;
  pecas: ItemOsInterface[];
  bloqueado: boolean;
  onAlterado: () => Promise<void>;
  onRemover: (idItemOs: number) => Promise<void>;
}

function PecasTab({ numOs, pecas, bloqueado, onAlterado, onRemover }: PecasTabProps) {
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [valor, setValor] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const valorNumero = paraNumero(valor);
  const podeEnviar = descricao.trim().length > 0 && valorNumero > 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!podeEnviar) return;

    setEnviando(true);
    setErro(null);

    try {
      await lancarItemOs({
        numOs,
        tipo: "PECA",
        descricao: descricao.trim(),
        quantidade,
        valorUnitario: valorNumero,
      });

      setDescricao("");
      setValor("");
      setQuantidade(1);
      await onAlterado();
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível lançar a peça."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {!bloqueado && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
          <SecaoTitulo>Lançar peça</SecaoTitulo>

          <div className="flex flex-col gap-2">
            <Label htmlFor="descricao-peca">Peça utilizada</Label>
            <Input
              id="descricao-peca"
              maxLength={150}
              placeholder="Ex.: Tela iPhone 13 incell"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Quantidade</Label>
              <div className="flex h-11 items-center justify-between rounded-xl border border-input bg-background px-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Diminuir"
                  disabled={quantidade <= 1}
                  onClick={() => setQuantidade((q) => q - 1)}
                >
                  <Minus />
                </Button>
                <span className="text-base font-semibold tabular-nums">{quantidade}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Aumentar"
                  onClick={() => setQuantidade((q) => q + 1)}
                >
                  <Plus />
                </Button>
              </div>
            </div>
            <CampoValor id="valor-peca" rotulo="Valor unitário" valor={valor} onChange={setValor} />
          </div>

          <Alert mensagem={erro} />

          <Button type="submit" disabled={enviando || !podeEnviar} className="h-11 self-end rounded-xl px-5">
            {enviando ? <Loader2 className="animate-spin" /> : <Plus />}
            {podeEnviar
              ? `Adicionar ${formatarMoeda(quantidade * valorNumero)} ao orçamento`
              : "Adicionar ao orçamento"}
          </Button>
        </form>
      )}

      <section className="flex flex-col gap-3">
        <SecaoTitulo>Peças lançadas</SecaoTitulo>
        <ItensLancados
          itens={pecas}
          vazio="Nenhuma peça lançada nesta O.S."
          podeRemover={!bloqueado}
          onRemover={onRemover}
        />
      </section>
    </div>
  );
}

export default PecasTab;