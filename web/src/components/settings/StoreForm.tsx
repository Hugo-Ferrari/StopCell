import { useState } from "react";
import { Loader2, Save, Building2, Phone, MapPin, Hash } from "lucide-react";
import Alert from "@/components/common/Alert";
import { mensagemDeErro } from "@/utils/apiError";
import { formatarCnpj, formatarTelefone, formatarCep } from "@/utils/masks";
import { useViaCep } from "@/hooks/useViaCep";
import FormInput from "@/components/common/FormInput";
import type { EmpresaDTO, UpdateEmpresaDTO } from "@/services/enterpriseService";

interface StoreFormProps {
  initialData: EmpresaDTO;
  onSave: (data: UpdateEmpresaDTO) => Promise<void>;
  loading: boolean;
  onCancelar: () => void;
}

export default function StoreForm({ initialData, onSave, loading, onCancelar }: StoreFormProps) {
  const [nomeFantasia, setNomeFantasia] = useState(initialData.nomeFantasia || "");
  const [razaoSocial, setRazaoSocial] = useState(initialData.razaoSocial || "");
  const [telefone, setTelefone] = useState(initialData.telefone || "");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState(initialData.endereco || "");
  // o CNPJ não é editável, só aparece no formulário
  const cnpj = initialData.cnpj || "";

  const { buscarCep, carregandoCep } = useViaCep();

  const [erro, setErro] = useState("");

  async function handleCepChange(value: string) {
    const raw = value.replace(/\D/g, "").slice(0, 8);
    setCep(raw);

    if (raw.length === 8) {
      const enderecoEncontrado = await buscarCep(raw);
      if (enderecoEncontrado?.enderecoFormatado) {
        setEndereco(enderecoEncontrado.enderecoFormatado);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanTelefone = telefone.replace(/\D/g, "");

    if (!nomeFantasia.trim()) {
      return setErro("Informe o Nome Fantasia da loja.");
    }

    if (!cleanTelefone) {
      return setErro("Informe um telefone de contato.");
    }

    if (!endereco.trim()) {
      return setErro("Informe o endereço da loja.");
    }

    setErro("");

    try {
      await onSave({
        nomeFantasia: nomeFantasia.trim(),
        razaoSocial: razaoSocial.trim() || nomeFantasia.trim(),
        telefone: cleanTelefone,
        endereco: endereco.trim(),
      });
    } catch (error) {
      setErro(mensagemDeErro(error, "Erro ao salvar dados da loja."));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-xl border border-border bg-card p-5 sm:p-7 flex flex-col gap-5"
    >
      <Alert mensagem={erro} />

      <div>
        <h2 className="text-lg font-bold text-foreground">
          Editar Informações da Loja
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Essas informações são impressas nas Ordens de Serviço
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Nome Fantasia *"
          id="nomeFantasia"
          icon={<Building2 size={16} />}
          value={nomeFantasia}
          onChange={(e) => setNomeFantasia(e.target.value)}
          placeholder="Ex: Stop Cell Assistência"
          required
        />

        <FormInput
          label="Razão Social"
          id="razaoSocial"
          icon={<Building2 size={16} />}
          value={razaoSocial}
          onChange={(e) => setRazaoSocial(e.target.value)}
          placeholder="Ex: Stop Cell LTDA"
        />

        <FormInput
          label="CNPJ"
          id="cnpj"
          icon={<Hash size={16} />}
          value={cnpj ? formatarCnpj(cnpj) : ""}
          disabled
          helperText="Identificador fixo da empresa (não editável)"
          className="cursor-not-allowed opacity-70 font-mono"
        />

        <FormInput
          label="Telefone / WhatsApp *"
          id="telefone"
          icon={<Phone size={16} />}
          value={formatarTelefone(telefone)}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="(00) 00000-0000"
          required
        />

        <FormInput
          label="CEP"
          id="cep"
          icon={<MapPin size={16} />}
          value={formatarCep(cep)}
          onChange={(e) => handleCepChange(e.target.value)}
          placeholder="00000-000"
          rightElement={
            carregandoCep ? (
              <span className="text-xs text-primary flex items-center gap-1 font-medium">
                <Loader2 size={14} className="animate-spin" /> Buscando...
              </span>
            ) : null
          }
          helperText="Preencha o CEP para preencher o endereço automaticamente"
        />

        <FormInput
          label="Endereço Completo *"
          id="endereco"
          icon={<MapPin size={16} />}
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Rua, Número, Bairro, Cidade - UF"
          required
        />
      </div>

      <div className="flex flex-col-reverse gap-3 pt-4 border-t border-border mt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancelar}
          disabled={loading}
          className="flex items-center justify-center rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:opacity-50 cursor-pointer"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Salvando...
            </>
          ) : (
            <>
              <Save size={16} /> Salvar Alterações
            </>
          )}
        </button>
      </div>
    </form>
  );
}

