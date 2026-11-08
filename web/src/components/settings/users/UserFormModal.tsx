import { useState, type FormEvent } from "react";
import { AtSign, Lock, Mail, User } from "lucide-react";
import Modal from "@/components/common/Modal";
import Alert from "@/components/common/Alert";
import FormInput from "@/components/common/FormInput";
import CampoSelect from "@/components/common/CampoSelect";
import type { PerfilAcesso } from "@/services/perfilService";
import type { AtualizarUsuarioDTO, UsuarioDaLoja } from "@/services/userService";
import { emailValido } from "@/utils/validartors";
import { mensagemDeErro } from "@/utils/apiError";

interface UserFormModalProps {
  /** sem usuario = cadastrando um novo */
  usuario?: UsuarioDaLoja;
  perfis: PerfilAcesso[];
  onFechar: () => void;
  onSalvar: (dados: AtualizarUsuarioDTO) => Promise<void>;
}

function UserFormModal({ usuario, perfis, onFechar, onSalvar }: UserFormModalProps) {
  const editando = Boolean(usuario);

  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [login, setLogin] = useState(usuario?.login ?? "");
  const [email, setEmail] = useState(usuario?.emailUsuario ?? "");
  const [senha, setSenha] = useState("");
  const [idPerfil, setIdPerfil] = useState<number | "">(usuario?.perfil?.idPerfil ?? "");
  const [ativo, setAtivo] = useState(usuario?.ativo ?? true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function validar(): string | null {
    if (!nome.trim() || !login.trim()) return "Preencha nome e usuário.";
    if (!emailValido(email)) return "Digite um e-mail válido.";
    // na edição a senha é opcional (só troca se digitar)
    if (!editando && senha.length < 6) return "A senha precisa ter pelo menos 6 caracteres.";
    if (editando && senha && senha.length < 6) return "A nova senha precisa ter pelo menos 6 caracteres.";
    if (idPerfil === "") return "Escolha um perfil de acesso.";
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const problema = validar();
    if (problema) return setErro(problema);

    setErro(null);
    setSalvando(true);
    try {
      await onSalvar({
        nome: nome.trim(),
        login: login.trim(),
        emailUsuario: email.trim(),
        senha: senha || undefined,
        idPerfil: Number(idPerfil),
        ativo: editando ? ativo : undefined,
      });
      onFechar();
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível salvar o usuário."));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal
      aberto
      titulo={editando ? "Editar usuário" : "Novo usuário"}
      descricao={editando ? undefined : "O funcionário vai entrar com o e-mail e a senha definidos aqui"}
      onFechar={onFechar}
      tamanho="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormInput
          label="Nome completo"
          name="nome"
          icon={<User size={18} />}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do funcionário"
          autoFocus
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="Usuário"
            name="login"
            icon={<AtSign size={18} />}
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Ex: joao"
            autoComplete="off"
          />
          <FormInput
            label="E-mail"
            name="emailUsuario"
            type="email"
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            autoComplete="off"
          />
        </div>

        <FormInput
          label={editando ? "Nova senha" : "Senha"}
          name="senha"
          type="password"
          icon={<Lock size={18} />}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder={editando ? "Deixe em branco para manter a atual" : "Mínimo 6 caracteres"}
          autoComplete="new-password"
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="idPerfil" className="text-xs font-medium text-foreground sm:text-sm">
            Perfil de acesso
          </label>
          <CampoSelect
            id="idPerfil"
            value={idPerfil === "" ? null : idPerfil}
            onChange={setIdPerfil}
            opcoes={perfis.map((p) => ({ value: p.idPerfil, label: p.nome }))}
            placeholder="Selecione um perfil"
            className="px-3.5 py-2.5 text-sm"
          />
        </div>

        {editando && (
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-border p-3">
            <span className="flex flex-col">
              <span className="text-sm font-medium text-foreground">Acesso ativo</span>
              <span className="text-xs text-muted-foreground">
                Desativado, o usuário não consegue mais entrar no sistema
              </span>
            </span>
            <input
              type="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              className="h-5 w-5 shrink-0 cursor-pointer accent-[var(--primary)]"
            />
          </label>
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
            {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar usuário"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default UserFormModal;