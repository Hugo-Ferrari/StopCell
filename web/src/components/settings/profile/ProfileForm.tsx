import { useState } from "react";
import { AtSign, Briefcase, Loader2, Mail, Save, User } from "lucide-react";
import Alert from "@/components/common/Alert";
import FormInput from "@/components/common/FormInput";
import { mensagemDeErro } from "@/utils/apiError";
import type { AtualizarMeuPerfilDTO, UsuarioLogado } from "@/services/userService";

interface ProfileFormProps {
  usuario: UsuarioLogado;
  onSalvar: (dados: AtualizarMeuPerfilDTO) => Promise<void>;
  salvando: boolean;
  onCancelar: () => void;
}

export default function ProfileForm({ usuario, onSalvar, salvando, onCancelar }: ProfileFormProps) {
  const [nome, setNome] = useState(usuario.nome || "");
  const [login, setLogin] = useState(usuario.login || "");
  const [email, setEmail] = useState(usuario.emailUsuario || "");
  const [erro, setErro] = useState("");

  const cargo = usuario.ehDono ? "Administrador" : (usuario.perfil?.nome ?? "Sem perfil");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome.trim()) return setErro("Informe seu nome.");
    if (!login.trim()) return setErro("Informe seu usuário.");
    if (!email.trim()) return setErro("Informe seu e-mail.");

    setErro("");

    try {
      await onSalvar({
        nome: nome.trim(),
        login: login.trim(),
        emailUsuario: email.trim(),
      });
    } catch (error) {
      setErro(mensagemDeErro(error, "Erro ao salvar seus dados."));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-5 rounded-xl border border-border bg-card p-5 sm:p-7"
    >
      <Alert mensagem={erro} />

      <div>
        <h2 className="text-lg font-bold text-foreground">Editar meus dados</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          O e-mail é o que você usa para entrar no sistema
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          label="Nome *"
          id="nome"
          icon={<User size={16} />}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={100}
          required
        />

        <FormInput
          label="Usuário (login) *"
          id="login"
          icon={<AtSign size={16} />}
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          maxLength={50}
          required
        />

        <FormInput
          label="E-mail *"
          id="email"
          type="email"
          icon={<Mail size={16} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={100}
          required
        />

        <FormInput
          label="Cargo"
          id="cargo"
          icon={<Briefcase size={16} />}
          value={cargo}
          disabled
          helperText="Quem define o cargo é o administrador da loja"
          className="cursor-not-allowed opacity-70"
        />
      </div>

      <div className="mt-2 flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancelar}
          disabled={salvando}
          className="flex cursor-pointer items-center justify-center rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={salvando}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
        >
          {salvando ? (
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
