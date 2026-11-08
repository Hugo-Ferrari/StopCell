import { AlertTriangle, MailCheck, MailX, Settings } from "lucide-react";
import type { AvisoClienteInterface, ResultadoAviso } from "@/types/ordemServico";
import { estiloStatus } from "@/utils/statusOs";
import { cn } from "@/lib/utils";

interface AvisosClienteProps {
  avisos: AvisoClienteInterface[];
}

const RESULTADO: Record<ResultadoAviso, { texto: string; icone: typeof MailCheck; cor: string }> = {
  ENVIADO: { texto: "E-mail enviado", icone: MailCheck, cor: "text-success" },
  FALHOU: { texto: "Falha no envio", icone: AlertTriangle, cor: "text-destructive" },
  SEM_EMAIL: { texto: "Cliente sem e-mail", icone: MailX, cor: "text-muted-foreground" },
  NAO_CONFIGURADO: { texto: "E-mail da loja não configurado", icone: Settings, cor: "text-muted-foreground" },
};

function dataHora(valor: string | null) {
  if (!valor) return "";
  return new Date(valor).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

// mostra pro técnico se o cliente ficou sabendo de cada mudança de status
function AvisosCliente({ avisos }: AvisosClienteProps) {
  if (avisos.length === 0) return null;

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Avisos ao cliente</h3>

      <ul className="flex flex-col gap-2.5">
        {avisos.map((aviso) => {
          const resultado = RESULTADO[aviso.statusEnvio ?? "FALHOU"] ?? RESULTADO.FALHOU;
          const Icone = resultado.icone;

          return (
            <li key={aviso.idLogNotificacao} className="flex items-start gap-3 text-sm">
              <Icone className={cn("mt-0.5 size-4 shrink-0", resultado.cor)} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-foreground">
                  {aviso.tipoEvento ? estiloStatus(aviso.tipoEvento).label : "Status"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {resultado.texto} · {dataHora(aviso.dtHoraEnvio)}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default AvisosCliente;