import { useState, useEffect } from "react";
import { Loader2, Save, CheckCircle2, XCircle } from "lucide-react";
import { formatarCnpj, formatarTelefone, formatarCep } from "@/utils/masks";
import type { EmpresaDTO } from "@/services/enterpriseService";

interface StoreFormProps {
  initialData: EmpresaDTO;
  onSave: (data: EmpresaDTO) => Promise<void>;
  loading: boolean;
}

export default function StoreForm({ initialData, onSave, loading }: StoreFormProps) {
  const [nomeFantasia, setNomeFantasia] = useState(initialData.nomeFantasia || "");
  const [razaoSocial, setRazaoSocial] = useState(initialData.razaoSocial || "");
  const [cnpj, setCnpj] = useState(initialData.cnpj || "");
  const [telefone, setTelefone] = useState(initialData.telefone || "");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState(initialData.endereco || "");
  const [buscandoCep, setBuscandoCep] = useState(false);

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

    // Auto-busca o endereço se tiver os 8 dígitos, sem precisar de botão ou lupa
    if (raw.length === 8) {
      setBuscandoCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
        const data = await res.json();
        if (!data.erro) {
          const novoEndereco = `${data.logradouro || ""}, Bairro ${data.bairro || ""}, ${data.localidade || ""} - ${data.uf || ""}`.replace(/^, /, "");
          setEndereco(novoEndereco);
        }
      } catch {
        // Se falhar a busca silenciosa, usuário pode preencher manualmente
      } finally {
        setBuscandoCep(false);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanCnpj = cnpj.replace(/\D/g, "");
    const cleanTelefone = telefone.replace(/\D/g, "");

    if (!nomeFantasia.trim()) {
      return showToast("Informe o Nome Fantasia da loja.", "error");
    }

    if (cleanCnpj.length !== 14) {
      return showToast("Informe um CNPJ válido com 14 dígitos.", "error");
    }

    if (!cleanTelefone) {
      return showToast("Informe um telefone de contato.", "error");
    }

    if (!endereco.trim()) {
      return showToast("Informe o endereço da loja.", "error");
    }

    try {
      await onSave({
        cnpj: cleanCnpj,
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
              : "bg-red-500/10 border border-red-500/30 text-red-400"
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
        <div className="flex flex-col gap-2">
          <label htmlFor="nomeFantasia" className="text-xs sm:text-sm font-medium text-foreground">
            Nome Fantasia *
          </label>
          <input
            id="nomeFantasia"
            type="text"
            value={nomeFantasia}
            onChange={(e) => setNomeFantasia(e.target.value)}
            placeholder="Ex: Stop Cell Assistência"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="razaoSocial" className="text-xs sm:text-sm font-medium text-foreground">
            Razão Social
          </label>
          <input
            id="razaoSocial"
            type="text"
            value={razaoSocial}
            onChange={(e) => setRazaoSocial(e.target.value)}
            placeholder="Ex: Stop Cell LTDA"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cnpj" className="text-xs sm:text-sm font-medium text-foreground">
            CNPJ *
          </label>
          <input
            id="cnpj"
            type="text"
            value={formatarCnpj(cnpj)}
            onChange={(e) => setCnpj(e.target.value)}
            placeholder="00.000.000/0000-00"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary font-mono"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="telefone" className="text-xs sm:text-sm font-medium text-foreground">
            Telefone / WhatsApp *
          </label>
          <input
            id="telefone"
            type="text"
            value={formatarTelefone(telefone)}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(00) 00000-0000"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cep" className="text-xs sm:text-sm font-medium text-foreground flex items-center justify-between">
            <span>CEP</span>
            {buscandoCep && (
              <span className="text-xs text-primary flex items-center gap-1">
                <Loader2 size={12} className="animate-spin" /> Buscando...
              </span>
            )}
          </label>
          <input
            id="cep"
            type="text"
            value={formatarCep(cep)}
            onChange={(e) => handleCepChange(e.target.value)}
            placeholder="00000-000"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="endereco" className="text-xs sm:text-sm font-medium text-foreground">
            Endereço Completo *
          </label>
          <input
            id="endereco"
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Rua, Número, Bairro, Cidade - UF"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-border mt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
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
