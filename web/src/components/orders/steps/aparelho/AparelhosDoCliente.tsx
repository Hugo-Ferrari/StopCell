import { useState } from "react";
import { Plus, Smartphone } from "lucide-react";
import Alert from "@/components/common/Alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAparelhosDoCliente } from "@/hooks/useAparelhosDoCliente";
import { useOpcoesAparelho } from "@/hooks/useOpcoesAparelho";
import { cn } from "@/lib/utils";
import AparelhoCard from "./AparelhoCard";
import AparelhoForm from "./AparelhoForm";

interface AparelhosDoClienteProps {
  cpfCliente: string;
  mostrarToast: (msg: string, tipo: "sucesso" | "erro") => void;
  // null quando o técnico volta a escolher, pra tela de cima esconder o checklist
  onAparelhoDefinido: (imei: string | null) => void;
}

const NOVO = "novo";

// passo 2 da nova O.S.: escolhe um aparelho que o cliente já trouxe ou cadastra outro
function AparelhosDoCliente({ cpfCliente, mostrarToast, onAparelhoDefinido }: AparelhosDoClienteProps) {
  const { aparelhos, carregando, erro, recarregar } = useAparelhosDoCliente(cpfCliente);
  const { categorias, marcas } = useOpcoesAparelho();

  // qual formulário está aberto: o IMEI de um aparelho da lista, "novo" ou nenhum
  const [aberto, setAberto] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState<string | null>(null);

  // cliente sem nenhum aparelho já cai direto no cadastro
  const formAberto = aberto ?? (!carregando && aparelhos.length === 0 && !confirmado ? NOVO : null);
  const aparelhoAberto = aparelhos.find((a) => a.imei === formAberto);

  function abrir(chave: string) {
    setAberto(chave);
    setConfirmado(null);
    onAparelhoDefinido(null);
  }

  async function handleConfirmado(imei: string) {
    setConfirmado(imei);
    setAberto(null);
    onAparelhoDefinido(imei);
    // o aparelho novo passa a aparecer na lista, já marcado
    await recarregar();
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-5 md:p-8">
      <div className="mb-5 flex flex-col gap-1">
        <h2 className="flex items-center gap-2 font-bold text-foreground">
          <Smartphone size={18} /> 2. Aparelho
        </h2>
        {aparelhos.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Escolha um aparelho que o cliente já trouxe ou cadastre um novo.
          </p>
        )}
      </div>

      <Alert mensagem={erro} />

      {carregando ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-[104px] rounded-2xl" />
          <Skeleton className="h-[104px] rounded-2xl" />
        </div>
      ) : (
        aparelhos.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            {aparelhos.map((aparelho) => (
              <AparelhoCard
                key={aparelho.imei}
                aparelho={aparelho}
                selecionado={formAberto === aparelho.imei || confirmado === aparelho.imei}
                confirmado={confirmado === aparelho.imei}
                onSelecionar={() => abrir(aparelho.imei)}
              />
            ))}

            <button
              type="button"
              onClick={() => abrir(NOVO)}
              className={cn(
                "flex min-h-[104px] items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 font-semibold transition-colors",
                formAberto === NOVO
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary",
              )}
            >
              <Plus className="size-5" /> Novo aparelho
            </button>
          </div>
        )
      )}

      {formAberto && (
        <div className={cn(aparelhos.length > 0 && "mt-5")}>
          <AparelhoForm
            // key força o formulário a recomeçar quando troca de aparelho
            key={formAberto}
            cpfCliente={cpfCliente}
            aparelho={aparelhoAberto}
            categorias={categorias}
            marcas={marcas}
            mostrarToast={mostrarToast}
            onConfirmado={handleConfirmado}
            onCancelar={aparelhos.length > 0 ? () => setAberto(null) : undefined}
          />
        </div>
      )}
    </div>
  );
}

export default AparelhosDoCliente;