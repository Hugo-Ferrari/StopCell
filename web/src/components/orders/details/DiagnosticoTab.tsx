import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Alert from "@/components/common/Alert";
import SecaoTitulo from "./SecaoTitulo";
import { salvarDiagnostico } from "@/services/diagnosisService";
import { mensagemDeErro } from "@/utils/apiError";
import type { DiagnosticoInterface } from "@/types/ordemServico";

interface DiagnosticoTabProps {
  numOs: number;
  relatoCliente?: string;
  diagnosticos: DiagnosticoInterface[];
  onSalvo: () => Promise<void>;
}

function formatarDataHora(data?: string) {
  if (!data) return "";
  return new Date(data).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function DiagnosticoTab({ numOs, relatoCliente, diagnosticos, onSalvo }: DiagnosticoTabProps) {
  const [texto, setTexto] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: "erro" | "sucesso" } | null>(null);

  // mais recente primeiro
  const historico = [...diagnosticos].sort(
    (a, b) => new Date(b.dataHora ?? 0).getTime() - new Date(a.dataHora ?? 0).getTime()
  );

  async function handleSalvar() {
    if (!texto.trim()) return;

    setSalvando(true);
    setMensagem(null);

    try {
      await salvarDiagnostico({ numOs, relatoTecnico: texto.trim() });
      setTexto("");
      setMensagem({ texto: "Diagnóstico registrado.", tipo: "sucesso" });
      await onSalvo();
    } catch (error) {
      setMensagem({ texto: mensagemDeErro(error, "Não foi possível salvar o diagnóstico."), tipo: "erro" });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {relatoCliente && (
        <section className="flex flex-col gap-2">
          <SecaoTitulo>Relato do cliente</SecaoTitulo>
          <p className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed">
            {relatoCliente}
          </p>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <SecaoTitulo>Diagnóstico técnico</SecaoTitulo>
        <Textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="O que foi encontrado no aparelho? Ex.: Face ID sem resposta, flex do sensor rompido."
          className="min-h-36 bg-card"
        />
        <Alert mensagem={mensagem?.texto} tipo={mensagem?.tipo} />
        <Button
          onClick={handleSalvar}
          disabled={salvando || !texto.trim()}
          className="h-11 self-end rounded-xl px-5"
        >
          {salvando ? <Loader2 className="animate-spin" /> : <Save />}
          Salvar diagnóstico
        </Button>
      </section>

      {historico.length > 0 && (
        <section className="flex flex-col gap-3">
          <SecaoTitulo>Registros anteriores</SecaoTitulo>
          <ol className="flex flex-col gap-2">
            {historico.map((item) => (
              <li key={item.idDiagnostico} className="rounded-xl border border-border bg-card px-4 py-3">
                <span className="text-xs text-muted-foreground">{formatarDataHora(item.dataHora)}</span>
                <p className="mt-1 text-sm whitespace-pre-line">{item.relatoTecnico}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

export default DiagnosticoTab;