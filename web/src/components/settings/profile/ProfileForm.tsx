import { useState, type FormEvent } from "react";
import { AtSign, Briefcase, Loader2, Mail, Save, User } from "lucide-react";
import Alert from "@/components/common/Alert";
import FormInput from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import { mensagemDeErro } from "@/utils/apiError";
import { emailValido } from "@/utils/validartors";
import { useErrosFormulario } from "@/hooks/useErrosFormulario";
import type { AtualizarMeuPerfilDTO, UsuarioLogado } from "@/services/userService";

interface ProfileFormProps {
  usuario: UsuarioLogado;
  onSalvar: (dados: AtualizarMeuPerfilDTO) => Promise<void>;
  salvando: boolean;
  onCancelar: () => void;
}

type Campo = "nome" | "login" | "email";

export default function ProfileForm({ usuario, onSalvar, salvando, onCancelar }: ProfileFormProps) {
  const [nome, setNome] = useState(usuario.nome || "");
  const [login, setLogin] = useState(usuario.login || "");
  const [email, setEmail] = useState(usuario.emailUsuario || "");
  const [erroApi, setErroApi] = useState("");

  const cargo = usuario.ehDono ? "Administrador" : (usuario.perfil?.nome ?? "Sem perfil");

  const { erro, tocar, podeEnviar } = useErrosFormulario<Campo>({
    nome: !nome.trim() ? "Informe seu nome" : undefined,
    login: !login.trim() ? "Informe seu usuário" : undefined,
    email: !emailValido(email.trim()) ? "Digite um e-mail válido, como nome@gmail.com" : undefined,
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErroApi("");

    if (!podeEnviar()) return;

    try {
      await onSalvar({
        nome: nome.trim(),
        login: login.trim(),
        emailUsuario: email.trim(),
      });
    } catch (error) {
      setErroApi(mensagemDeErro(error, "Não foi possível salvar seus dados."));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col gap-5 rounded-2xl border border-border bg-card p-5 animate-in fade-in slide-in-from-bottom-2 md:p-6"
    >
      <div>
        <h2 className="font-semibold text-foreground">Editar meus dados</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">O e-mail é o que você usa para entrar no sistema</p>
      </div>

      <Alert mensagem={erroApi} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormInput
          label="Nome *"
          id="nome"
          icon={<User size={18} />}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onBlur={tocar("nome")}
          placeholder="Nome e sobrenome"
          maxLength={100}
          error={erro("nome")}
        />

        <FormInput
          label="Usuário (login) *"
          id="login"
          icon={<AtSign size={18} />}
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          onBlur={tocar("login")}
          maxLength={50}
          error={erro("login")}
        />

        <FormInput
          label="E-mail *"
          id="email"
          type="email"
          icon={<Mail size={18} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={tocar("email")}
          placeholder="voce@email.com"
          maxLength={100}
          error={erro("email")}
        />

        <FormInput
          label="Cargo"
          id="cargo"
          icon={<Briefcase size={18} />}
          value={cargo}
          disabled
          helperText="Quem define o cargo é o administrador da loja"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancelar} disabled={salvando} className="h-12 rounded-xl px-8">
          Cancelar
        </Button>
        <Button type="submit" disabled={salvando} className="h-12 rounded-xl px-8">
          {salvando ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Salvar alterações
        </Button>
      </div>
    </form>
  );
}
