import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  PackageCheck,
  PackageSearch,
  Send,
  Stethoscope,
  Undo2,
  Wrench,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Alert from "@/components/common/Alert";
import FinalizarComPagamento from "./FinalizarComPagamento";
import CancelarOsDialog from "./CancelarOsDialog";
import { atualizarStatusOs } from "@/services/serviceOrderService";
import { mensagemDeErro } from "@/utils/apiError";
import type { StatusOs } from "@/types/ordemServico";

interface AcoesStatusProps {
  numOs: number;
  status: StatusOs;
  total: number;
  onAlterado: () => Promise<void>;
}

interface Acao {
  para: StatusOs;
  texto: string;
  icone: typeof Wrench;
  // aprovar ou enviar orçamento zerado não faz sentido
  exigeValor?: boolean;
}

// mesmo fluxo que o back valida em ordem-servico/status-os.ts.
// "principal" é o botão grande, "secundarias" são os links menores embaixo
const FLUXO: Partial<Record<StatusOs, { principal?: Acao; secundarias: Acao[] }>> = {
  ABERTA: {
    principal: { para: "DIAGNOSTICO", texto: "Iniciar diagnóstico", icone: Stethoscope },
    secundarias: [],
  },
  DIAGNOSTICO: {
    principal: { para: "EM_APROVACAO", texto: "Enviar orçamento pro cliente", icone: Send, exigeValor: true },
    secundarias: [],
  },
  EM_APROVACAO: {
    principal: { para: "EM_REPARO", texto: "Cliente aprovou, iniciar reparo", icone: Wrench },
    secundarias: [{ para: "DIAGNOSTICO", texto: "Voltar pro diagnóstico", icone: Undo2 }],
  },
  // a finalização tem o bloco de pagamento, por isso não tem "principal" aqui
  EM_REPARO: {
    secundarias: [{ para: "AGUARDANDO_PECA", texto: "Parar: aguardando peça", icone: PackageSearch }],
  },
  AGUARDANDO_PECA: {
    principal: { para: "EM_REPARO", texto: "Peça chegou, voltar ao reparo", icone: PackageCheck },
    secundarias: [],
  },
};

function AcoesStatus({ numOs, status, total, onAlterado }: AcoesStatusProps) {
  const [salvando, setSalvando] = useState<StatusOs | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  if (status === "FINALIZADO") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 px-4 py-4 text-sm font-medium text-success">
        <CheckCircle2 className="size-5 shrink-0" />
        O.S. finalizada. Não dá mais pra mexer no orçamento.
      </div>
    );
  }

  if (status === "CANCELADO") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted px-4 py-4 text-sm font-medium text-muted-foreground">
        <XCircle className="size-5 shrink-0" />
        O.S. cancelada.
      </div>
    );
  }

  const fluxo = FLUXO[status] ?? { secundarias: [] };

  async function mudarPara(acao: Acao) {
    setSalvando(acao.para);
    setErro(null);

    try {
      await atualizarStatusOs(numOs, acao.para);
      await onAlterado();
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível atualizar o status da O.S."));
    } finally {
      setSalvando(null);
    }
  }

  const principal = fluxo.principal;
  const semValor = Boolean(principal?.exigeValor) && total <= 0;

  return (
    <div className="flex flex-col gap-3">
      {status === "EM_REPARO" &&
        (total > 0 ? (
          <FinalizarComPagamento numOs={numOs} total={total} onAlterado={onAlterado} />
        ) : (
          <p className="rounded-2xl border border-dashed border-border px-4 py-4 text-center text-sm text-muted-foreground">
            Lance pelo menos uma peça ou mão de obra pra poder finalizar.
          </p>
        ))}

      {principal && (
        <Button
          onClick={() => mudarPara(principal)}
          disabled={salvando !== null || semValor}
          className="h-14 w-full rounded-2xl text-base font-bold"
        >
          {salvando === principal.para ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <principal.icone className="size-5" />
          )}
          {principal.texto}
        </Button>
      )}

      {semValor && (
        <p className="text-center text-xs text-muted-foreground">
          Lance pelo menos uma peça ou mão de obra pra enviar o orçamento.
        </p>
      )}

      <Alert mensagem={erro} />

      <div className="flex flex-col gap-1">
        {fluxo.secundarias.map((acao) => (
          <Button
            key={acao.para}
            variant="ghost"
            onClick={() => mudarPara(acao)}
            disabled={salvando !== null}
            className="h-10 w-full rounded-xl text-muted-foreground"
          >
            {salvando === acao.para ? <Loader2 className="animate-spin" /> : <acao.icone />}
            {acao.texto}
          </Button>
        ))}

        <CancelarOsDialog numOs={numOs} onCancelada={onAlterado} />
      </div>
    </div>
  );
}

export default AcoesStatus;