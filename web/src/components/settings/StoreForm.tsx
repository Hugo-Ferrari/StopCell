import { useState, type FormEvent } from "react";
import { Building2, Hash, Loader2, MapPin, Phone, Save } from "lucide-react";
import Alert from "@/components/common/Alert";
import FormInput from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import { mensagemDeErro } from "@/utils/apiError";
import { formatarCep, formatarCnpj, formatarTelefone } from "@/utils/masks";
import { telefoneValido } from "@/utils/validartors";
import { useViaCep } from "@/hooks/useViaCep";
import { useErrosFormulario } from "@/hooks/useErrosFormulario";
import type { EmpresaDTO, UpdateEmpresaDTO } from "@/services/enterpriseService";

interface StoreFormProps {
  initialData: EmpresaDTO;
  onSave: (data: UpdateEmpresaDTO) => Promise<void>;
  loading: boolean;
  onCancelar: () => void;
}

type Campo = "nomeFantasia" | "telefone" | "endereco";

export default function StoreForm({ initialData, onSave, loading, onCancelar }: StoreFormProps) {
  const [nomeFantasia, setNomeFantasia] = useState(initialData.nomeFantasia || "");
  const [razaoSocial, setRazaoSocial] = useState(initialData.razaoSocial || "");
  const [telefone, setTelefone] = useState(formatarTelefone(initialData.telefone || ""));
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState(initialData.endereco || "");
  const [erroApi, setErroApi] = useState("");
  const cnpj = initialData.cnpj || "";

  const { buscarCep, carregandoCep, erroCep } = useViaCep();

  const telefoneLimpo = telefone.replace(/\D/g, "");

  const { erro, tocar, podeEnviar } = useErrosFormulario<Campo>({
    nomeFantasia: !nomeFantasia.trim() ? "Informe o nome fantasia da loja" : undefined,
    telefone: !telefoneValido(telefoneLimpo) ? "Digite o DDD e o número" : undefined,
    endereco: !endereco.trim() ? "Informe o endereço da loja" : undefined,
  });

  async function handleCep(valor: string) {
    const formatado = formatarCep(valor);
    setCep(formatado);

    if (formatado.replace(/\D/g, "").length !== 8) return;

    const achado = await buscarCep(formatado);
    if (achado?.enderecoFormatado) setEndereco(`${achado.enderecoFormatado}, Nº `);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErroApi("");

    if (!podeEnviar()) return;

    try {
      await onSave({
        nomeFantasia: nomeFantasia.trim(),
        razaoSocial: razaoSocial.trim() || nomeFantasia.trim(),
        telefone: telefoneLimpo,
        endereco: endereco.trim(),
      });
    } catch (error) {
      setErroApi(mensagemDeErro(error, "Não foi possível salvar os dados da loja."));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col gap-5 rounded-2xl border border-border bg-card p-5 animate-in fade-in slide-in-from-bottom-2 md:p-6"
    >
      <div>
        <h2 className="font-semibold text-foreground">Editar dados da loja</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">Essas informações são impressas nas ordens de serviço</p>
      </div>

      <Alert mensagem={erroApi} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormInput
          label="Nome fantasia *"
          id="nomeFantasia"
          icon={<Building2 size={18} />}
          value={nomeFantasia}
          onChange={(e) => setNomeFantasia(e.target.value)}
          onBlur={tocar("nomeFantasia")}
          placeholder="Ex: Stop Cell Assistência"
          error={erro("nomeFantasia")}
        />

        <FormInput
          label="Razão social"
          id="razaoSocial"
          icon={<Building2 size={18} />}
          value={razaoSocial}
          onChange={(e) => setRazaoSocial(e.target.value)}
          placeholder="Ex: Stop Cell LTDA"
          helperText="Se ficar em branco, usa o nome fantasia"
        />

        <FormInput
          label="CNPJ"
          id="cnpj"
          icon={<Hash size={18} />}
          value={cnpj ? formatarCnpj(cnpj) : ""}
          disabled
          helperText="Não pode ser alterado"
        />

        <FormInput
          label="Telefone / WhatsApp *"
          id="telefone"
          icon={<Phone size={18} />}
          type="tel"
          inputMode="numeric"
          value={telefone}
          onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
          onBlur={tocar("telefone")}
          placeholder="(00) 00000-0000"
          maxLength={15}
          error={erro("telefone")}
        />

        <FormInput
          label="CEP"
          id="cep"
          icon={<MapPin size={18} />}
          inputMode="numeric"
          value={cep}
          onChange={(e) => void handleCep(e.target.value)}
          placeholder="00000-000"
          maxLength={9}
          error={erroCep ?? undefined}
          helperText={carregandoCep ? "Buscando endereço..." : "Preenche o endereço sozinho"}
        />

        <FormInput
          label="Endereço completo *"
          id="endereco"
          icon={<MapPin size={18} />}
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          onBlur={tocar("endereco")}
          placeholder="Rua, número, bairro, cidade"
          error={erro("endereco")}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancelar} disabled={loading} className="h-12 rounded-xl px-8">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="h-12 rounded-xl px-8">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Salvar alterações
        </Button>
      </div>
    </form>
  );
}
