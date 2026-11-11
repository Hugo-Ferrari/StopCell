import { useState, type FormEvent } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CampoValor from "@/components/orders/details/CampoValor";
import Alert from "@/components/common/Alert";
import { criarDespesa } from "@/services/financeiroService";
import { mensagemDeErro } from "@/utils/apiError";
import { paraNumero } from "@/utils/moeda";

interface FormularioDespesaProps {
  onCriada: () => Promise<void>;
}

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
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);

    const valorNumero = paraNumero(valor);
    if (!descricao.trim() || valorNumero <= 0) {
      setErro("Informe a descrição e um valor maior que zero.");
      return;
    }

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
      await onCriada();
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível lançar a despesa."));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="despesa-descricao">Descrição</Label>
        <Input
          id="despesa-descricao"
          maxLength={150}
          placeholder="Aluguel, energia, material..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>

      <CampoValor id="despesa-valor" rotulo="Valor" valor={valor} onChange={setValor} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="despesa-data">Data</Label>
        <Input
          id="despesa-data"
          type="date"
          value={dataDespesa}
          onChange={(e) => setDataDespesa(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={salvando} className="h-11 rounded-xl">
        {salvando ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        Lançar despesa
      </Button>

      <Alert mensagem={erro} />
    </form>
  );
}

export default FormularioDespesa;
