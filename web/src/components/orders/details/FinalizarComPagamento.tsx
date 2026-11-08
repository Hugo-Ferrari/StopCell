import { useCallback, useEffect, useState } from "react";
import { Banknote, CheckCircle2, CreditCard, FileText, Loader2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import Alert from "@/components/common/Alert";
import CampoValor from "./CampoValor";
import {
  listarPagamentosOs,
  registrarPagamento,
  type FormaPagamento,
} from "@/services/pagamentoService";
import { atualizarStatusOs } from "@/services/serviceOrderService";
import { mensagemDeErro } from "@/utils/apiError";
import { formatarMoeda, paraNumero } from "@/utils/moeda";
import { cn } from "@/lib/utils";

interface FinalizarComPagamentoProps {
  numOs: number;
  total: number;
  onAlterado: () => Promise<void>;
}

const FORMAS: { valor: FormaPagamento; texto: string; icone: typeof Banknote }[] = [
  { valor: "PIX", texto: "Pix", icone: QrCode },
  { valor: "DINHEIRO", texto: "Dinheiro", icone: Banknote },
  { valor: "CARTAO", texto: "Cartão", icone: CreditCard },
  { valor: "BOLETO", texto: "Boleto", icone: FileText },
];

function emTexto(numero: number) {
  return numero.toFixed(2).replace(".", ",");
}

// o back só deixa finalizar com tudo pago, então o recebimento fica aqui mesmo,
// junto do botão de finalizar, em vez de mandar o técnico pra outra tela
function FinalizarComPagamento({ numOs, total, onAlterado }: FinalizarComPagamentoProps) {
  const [pago, setPago] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [forma, setForma] = useState<FormaPagamento>("PIX");
  const [valor, setValor] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarPagamentos = useCallback(async () => {
    try {
      const pagamentos = await listarPagamentosOs(numOs);
      const somaPago = pagamentos.reduce((soma, p) => soma + paraNumero(p.valorPago), 0);
      setPago(somaPago);
      setValor(emTexto(Math.max(total - somaPago, 0)));
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível carregar os pagamentos da O.S."));
    } finally {
      setCarregando(false);
    }
  }, [numOs, total]);

  useEffect(() => {
    void carregarPagamentos();
  }, [carregarPagamentos]);

  // arredonda pra centavos, senão 0.1 + 0.2 vira saldo de 0,0000001
  const saldo = Math.max(Math.round((total - pago) * 100) / 100, 0);
  const valorNumero = paraNumero(valor);
  const quitaTudo = valorNumero >= saldo;

  async function finalizar() {
    await atualizarStatusOs(numOs, "FINALIZADO");
    await onAlterado();
  }

  async function handleConfirmar() {
    setSalvando(true);
    setErro(null);

    try {
      if (saldo > 0) {
        await registrarPagamento(numOs, valorNumero, forma);

        // pagamento parcial: registra e deixa a O.S. aberta esperando o resto
        if (!quitaTudo) {
          await carregarPagamentos();
          return;
        }
      }

      await finalizar();
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível concluir a O.S."));
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <div className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-border text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Carregando pagamentos...
      </div>
    );
  }

  const valorInvalido = saldo > 0 && (valorNumero <= 0 || valorNumero > saldo);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-col gap-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Já recebido</span>
          <span className="tabular-nums">{formatarMoeda(pago)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Falta receber</span>
          <span className="tabular-nums">{formatarMoeda(saldo)}</span>
        </div>
      </div>

      {saldo > 0 && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {FORMAS.map(({ valor: opcao, texto, icone: Icone }) => (
              <button
                key={opcao}
                type="button"
                onClick={() => setForma(opcao)}
                className={cn(
                  "flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors",
                  forma === opcao
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                <Icone className="size-4" />
                {texto}
              </button>
            ))}
          </div>

          <CampoValor id="valor-pagamento" rotulo="Valor recebido" valor={valor} onChange={setValor} />

          {valorNumero > saldo && (
            <p className="text-xs text-destructive">O valor passa do que falta receber.</p>
          )}
        </>
      )}

      <Button
        onClick={handleConfirmar}
        disabled={salvando || valorInvalido}
        className={cn(
          "h-14 w-full rounded-2xl text-base font-bold",
          quitaTudo && "bg-success text-white hover:bg-success/90",
        )}
      >
        {salvando ? <Loader2 className="size-5 animate-spin" /> : <CheckCircle2 className="size-5" />}
        {saldo <= 0
          ? "Finalizar O.S."
          : quitaTudo
            ? "Receber e finalizar O.S."
            : "Registrar pagamento parcial"}
      </Button>

      <Alert mensagem={erro} />
    </div>
  );
}

export default FinalizarComPagamento;