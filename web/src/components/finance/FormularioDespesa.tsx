import { useState, type FormEvent } from "react";
import { CalendarDays, FileText, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/common/FormInput";
import CampoValor from "@/components/orders/details/CampoValor";
import Alert from "@/components/common/Alert";
import { useErrosFormulario } from "@/hooks/useErrosFormulario";
import { criarDespesa } from "@/services/financeiroService";
import { mensagemDeErro } from "@/utils/apiError";
import { paraNumero } from "@/utils/moeda";

interface FormularioDespesaProps {
  onCriada: () => Promise<void>;
}

type Campo = "descricao" | "valor" | "data";

function hojeIso() {
  const agora = new Date();
  const m = String(agora.getMonth() + 1).padStart(2, "0");
  const d = String(agora.getDate()).padStart(2, "0");
  return `${agora.getFullYear()}-${m}-${d}`;
}

function FormularioDespesa({ onCriada }: FormularioDespesaProps) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [dataDespesa, setDataDespesa] = useState(hojeIso);
  const [salvando, setSalvando] = useState(false);
  const [erroApi, setErroApi] = useState<string | null>(null);

  const valorNumero = paraNumero(valor);

  const { erro, tocar, podeEnviar, reiniciar } = useErrosFormulario<Campo>({
    descricao: !descricao.trim() ? "Informe a descrição" : undefined,
    valor: valorNumero <= 0 ? "Informe um valor maior que zero" : undefined,
    data: !dataDespesa ? "Informe a data" : undefined,
  });

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErroApi(null);

    if (!podeEnviar()) return;

    setSalvando(true);
    try {
      await criarDespesa({
        descricao: descricao.trim(),
        valor: valorNumero,
        dataDespesa,
      });
      setDescricao("");
      setValor("");
      setDataDespesa(hojeIso());
      reiniciar();
      await onCriada();
    } catch (error) {
      setErroApi(mensagemDeErro(error, "Não foi possível lançar a despesa."));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <FormInput
        label="Descrição *"
        id="despesa-descricao"
        icon={<FileText size={18} />}
        maxLength={150}
        placeholder="Aluguel, energia, material..."
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        onBlur={tocar("descricao")}
        error={erro("descricao")}
      />

      <CampoValor
        id="despesa-valor"
        rotulo="Valor *"
        valor={valor}
        onChange={setValor}
        onBlur={tocar("valor")}
        erro={erro("valor")}
      />

      <FormInput
        label="Data *"
        id="despesa-data"
        type="date"
        icon={<CalendarDays size={18} />}
        value={dataDespesa}
        onChange={(e) => setDataDespesa(e.target.value)}
        onBlur={tocar("data")}
        error={erro("data")}
      />

      <Alert mensagem={erroApi} />

      <Button type="submit" disabled={salvando} className="h-12 rounded-xl px-8">
        {salvando ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        Lançar despesa
      </Button>
    </form>
  );
}

export default FormularioDespesa;
