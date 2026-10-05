import { useState, useEffect } from "react";
import { Loader2, Save, CheckCircle2, XCircle, Building2, Phone, MapPin, Hash } from "lucide-react";
import { formatarCnpj, formatarTelefone, formatarCep } from "@/utils/masks";
import { useViaCep } from "@/hooks/useViaCep";
import FormInput from "@/components/common/FormInput";
import type { EmpresaDTO, UpdateEmpresaDTO } from "@/services/enterpriseService";

interface StoreFormProps {
  initialData: EmpresaDTO;
  onSave: (data: UpdateEmpresaDTO) => Promise<void>;
  loading: boolean;
}

export default function StoreForm({ initialData, onSave, loading }: StoreFormProps) {
  const [nomeFantasia, setNomeFantasia] = useState(initialData.nomeFantasia || "");
  const [razaoSocial, setRazaoSocial] = useState(initialData.razaoSocial || "");
  const [cnpj, setCnpj] = useState(initialData.cnpj || "");
  const [telefone, setTelefone] = useState(initialData.telefone || "");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState(initialData.endereco || "");

  const { buscarCep, carregandoCep } = useViaCep();

  useEffect(() => {
    setNomeFantasia(initialData.nomeFantasia || "");
    setRazaoSocial(initialData.razaoSocial || "");
    setCnpj(initialData.cnpj || "");
    setTelefone(initialData.telefone || "");
    setEndereco(initialData.endereco || "");
  }, [initialData]);

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
  }>({ visible: false, message: "", type: "success" });

  function showToast(message: string, type: "success" | "error") {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 4000);
  }

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
      return showToast("Informe o Nome Fantasia da loja.", "error");
    }

    if (!cleanTelefone) {
      return showToast("Informe um telefone de contato.", "error");
    }

    if (!endereco.trim()) {
      return showToast("Informe o endereço da loja.", "error");
    }

    try {
      await onSave({
        nomeFantasia: nomeFantasia.trim(),
        razaoSocial: razaoSocial.trim() || nomeFantasia.trim(),
        telefone: cleanTelefone,
        endereco: endereco.trim(),
      });
      showToast("Dados salvos com sucesso!", "success");
    } catch {
      showToast("Erro ao salvar dados da loja.", "error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-xl border border-border bg-card p-5 sm:p-7 flex flex-col gap-5"
    >
      {toast.visible && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-green-500/10 border border-green-500/30 text-green-400"
              : "bg-destructive/10 border border-destructive/30 text-destructive"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} className="shrink-0" />
          ) : (
            <XCircle size={18} className="shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-foreground">
          Editar Informações da Loja
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Essas informações são impressas nas Ordens de Serviço e no cabeçalho do sistema
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

      <div className="flex justify-end pt-2 border-t border-border mt-2">
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

