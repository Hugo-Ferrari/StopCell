import { useState, type FormEvent } from "react";
import { FileText, Loader2, ShieldCheck } from "lucide-react";
import Modal from "@/components/common/Modal";
import Alert from "@/components/common/Alert";
import FormInput from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import { useErrosFormulario } from "@/hooks/useErrosFormulario";
import PermissionChecklist from "./PermissionChecklist";
import type { PerfilAcesso, PerfilDTO, PermissaoCatalogo } from "@/services/perfilService";
import { mensagemDeErro } from "@/utils/apiError";

interface ProfileFormModalProps {
  /** sem perfil = criando um novo */
  perfil?: PerfilAcesso;
  catalogo: PermissaoCatalogo[];
  onFechar: () => void;
  onSalvar: (dados: PerfilDTO) => Promise<void>;
}

type Campo = "nome" | "permissoes";

function ProfileFormModal({ perfil, catalogo, onFechar, onSalvar }: ProfileFormModalProps) {
  const [nome, setNome] = useState(perfil?.nome ?? "");
  const [descricao, setDescricao] = useState(perfil?.descricao ?? "");
  const [permissoes, setPermissoes] = useState<string[]>(perfil?.permissoes ?? []);
  const [salvando, setSalvando] = useState(false);
  const [erroApi, setErroApi] = useState<string | null>(null);

  const { erro, tocar, podeEnviar } = useErrosFormulario<Campo>({
    nome: !nome.trim() ? "Informe o nome do perfil" : undefined,
    permissoes: permissoes.length === 0 ? "Marque pelo menos uma permissão" : undefined,
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErroApi(null);

    if (!podeEnviar()) return;

    setSalvando(true);
    try {
      await onSalvar({ nome: nome.trim(), descricao: descricao.trim() || undefined, permissoes });
      onFechar();
    } catch (error) {
      setErroApi(mensagemDeErro(error, "Não foi possível salvar o perfil."));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal
      aberto
      titulo={perfil ? "Editar perfil" : "Novo perfil de acesso"}
      descricao="Escolha o que quem tiver esse perfil pode acessar"
      onFechar={onFechar}
      tamanho="max-w-xl"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <FormInput
          label="Nome do perfil *"
          name="nome"
          icon={<ShieldCheck size={18} />}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onBlur={tocar("nome")}
          placeholder="Ex: Técnico, Atendente"
          maxLength={50}
          error={erro("nome")}
          autoFocus
        />

        <FormInput
          label="Descrição"
          name="descricao"
          icon={<FileText size={18} />}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Faz os reparos na bancada"
          maxLength={150}
          helperText="Opcional"
        />

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-foreground sm:text-sm">Permissões *</span>
          <PermissionChecklist catalogo={catalogo} selecionadas={permissoes} onChange={setPermissoes} />
          {erro("permissoes") && <span className="text-xs text-destructive">{erro("permissoes")}</span>}
        </div>

        {perfil && perfil.totalUsuarios > 0 && (
          <p className="text-xs text-muted-foreground">
            A alteração vale na hora para os {perfil.totalUsuarios} usuário(s) com este perfil.
          </p>
        )}

        <Alert mensagem={erroApi} />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onFechar} className="h-12 rounded-xl px-8">
            Cancelar
          </Button>
          <Button type="submit" disabled={salvando} className="h-12 rounded-xl px-8">
            {salvando && <Loader2 className="size-4 animate-spin" />}
            Salvar perfil
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ProfileFormModal;
