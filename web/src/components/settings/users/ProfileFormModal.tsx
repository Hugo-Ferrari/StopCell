import { useState, type FormEvent } from "react";
import Modal from "@/components/common/Modal";
import Alert from "@/components/common/Alert";
import FormInput from "@/components/common/FormInput";
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

function ProfileFormModal({ perfil, catalogo, onFechar, onSalvar }: ProfileFormModalProps) {
  const [nome, setNome] = useState(perfil?.nome ?? "");
  const [descricao, setDescricao] = useState(perfil?.descricao ?? "");
  const [permissoes, setPermissoes] = useState<string[]>(perfil?.permissoes ?? []);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!nome.trim()) return setErro("Informe o nome do perfil.");
    if (permissoes.length === 0) return setErro("Marque pelo menos uma permissão.");

    setErro(null);
    setSalvando(true);
    try {
      await onSalvar({ nome: nome.trim(), descricao: descricao.trim() || undefined, permissoes });
      onFechar();
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível salvar o perfil."));
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormInput
          label="Nome do perfil"
          name="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Técnico, Atendente"
          maxLength={50}
          autoFocus
        />

        <FormInput
          label="Descrição (opcional)"
          name="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Faz os reparos na bancada"
          maxLength={150}
        />

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-foreground sm:text-sm">Permissões</span>
          <PermissionChecklist catalogo={catalogo} selecionadas={permissoes} onChange={setPermissoes} />
        </div>

        {perfil && perfil.totalUsuarios > 0 && (
          <p className="text-xs text-muted-foreground">
            A alteração vale na hora para os {perfil.totalUsuarios} usuário(s) com este perfil.
          </p>
        )}

        <Alert mensagem={erro} />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onFechar}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {salvando ? "Salvando..." : "Salvar perfil"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ProfileFormModal;