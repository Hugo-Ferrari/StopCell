import { useState, type FormEvent } from "react";
import { AtSign, Loader2, Lock, Mail, User } from "lucide-react";
import Modal from "@/components/common/Modal";
import Alert from "@/components/common/Alert";
import FormInput from "@/components/common/FormInput";
import CampoSelect from "@/components/common/CampoSelect";
import { Button } from "@/components/ui/button";
import { useErrosFormulario } from "@/hooks/useErrosFormulario";
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

type Campo = "nome" | "login" | "email" | "senha" | "perfil";

function UserFormModal({ usuario, perfis, onFechar, onSalvar }: UserFormModalProps) {
  const editando = Boolean(usuario);

  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [login, setLogin] = useState(usuario?.login ?? "");
  const [email, setEmail] = useState(usuario?.emailUsuario ?? "");
  const [senha, setSenha] = useState("");
  const [idPerfil, setIdPerfil] = useState<number | null>(usuario?.perfil?.idPerfil ?? null);
  const [ativo, setAtivo] = useState(usuario?.ativo ?? true);
  const [salvando, setSalvando] = useState(false);
  const [erroApi, setErroApi] = useState<string | null>(null);

  const senhaCurta = senha.length < 6 && (!editando || senha.length > 0);

  const { erro, tocar, podeEnviar } = useErrosFormulario<Campo>({
    nome: !nome.trim() ? "Informe o nome do funcionário" : undefined,
    login: !login.trim() ? "Informe o usuário" : undefined,
    email: !emailValido(email.trim()) ? "Digite um e-mail válido" : undefined,
    senha: senhaCurta ? "A senha precisa ter pelo menos 6 caracteres" : undefined,
    perfil: idPerfil === null ? "Escolha um perfil de acesso" : undefined,
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErroApi(null);

    if (!podeEnviar()) return;

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
      setErroApi(mensagemDeErro(error, "Não foi possível salvar o usuário."));
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
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <FormInput
          label="Nome completo *"
          name="nome"
          icon={<User size={18} />}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onBlur={tocar("nome")}
          placeholder="Nome do funcionário"
          error={erro("nome")}
          autoFocus
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput
            label="Usuário *"
            name="login"
            icon={<AtSign size={18} />}
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            onBlur={tocar("login")}
            placeholder="Ex: joao"
            autoComplete="off"
            error={erro("login")}
          />
          <FormInput
            label="E-mail *"
            name="emailUsuario"
            type="email"
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={tocar("email")}
            placeholder="email@exemplo.com"
            autoComplete="off"
            error={erro("email")}
          />
        </div>

        <FormInput
          label={editando ? "Nova senha" : "Senha *"}
          name="senha"
          type="password"
          icon={<Lock size={18} />}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onBlur={tocar("senha")}
          placeholder={editando ? "Deixe em branco para manter a atual" : "Mínimo 6 caracteres"}
          autoComplete="new-password"
          error={erro("senha")}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="idPerfil" className="text-xs font-medium text-foreground sm:text-sm">
            Perfil de acesso *
          </label>
          <CampoSelect
            id="idPerfil"
            value={idPerfil}
            onChange={setIdPerfil}
            opcoes={perfis.map((p) => ({ value: p.idPerfil, label: p.nome }))}
            placeholder="Selecione um perfil"
            invalido={Boolean(erro("perfil"))}
            className="px-3.5 py-2.5 text-sm"
          />
          {erro("perfil") && <span className="text-xs text-destructive">{erro("perfil")}</span>}
        </div>

        {editando && (
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border p-4">
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
              className="size-5 shrink-0 cursor-pointer accent-[var(--primary)]"
            />
          </label>
        )}

        <Alert mensagem={erroApi} />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onFechar} className="h-12 rounded-xl px-8">
            Cancelar
          </Button>
          <Button type="submit" disabled={salvando} className="h-12 rounded-xl px-8">
            {salvando && <Loader2 className="size-4 animate-spin" />}
            {editando ? "Salvar alterações" : "Cadastrar usuário"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default UserFormModal;
