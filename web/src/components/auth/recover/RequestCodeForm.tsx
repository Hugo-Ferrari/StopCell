// esse formulário é usado na tela de recuperar senha, pra pedir o código de recuperação
// ele não faz a requisição, só chama o onSubmit que a tela passa
// ele também não valida se o e-mail existe, só se o formato é válido
import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import FormInput from "@/components/common/FormInput";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import AuthAlert from "@/components/auth/AuthAlert";
import { emailValido } from "@/utils/validartors";

interface RequestCodeFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
  carregando: boolean;
  erro?: string | null;
}

function RequestCodeForm({ email, onEmailChange, onSubmit, carregando, erro }: RequestCodeFormProps) {
  const [tocado, setTocado] = useState(false);

  // só mostra erro depois que a pessoa saiu do campo, senão fica vermelho enquanto digita
  const erroEmail =
    tocado && email.length > 0 && !emailValido(email)
      ? "Digite um e-mail válido (ex: nome@dominio.com)"
      : undefined;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTocado(true);
    if (!emailValido(email)) return;
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <FormInput
        label="E-mail"
        inputSize="lg"
        icon={<Mail size={18} />}
        type="email"
        name="email"
        autoComplete="email"
        autoFocus
        required
        value={email}
        onChange={(e) => onEmailChange(e.target.value.trim())}
        onBlur={() => setTocado(true)}
        placeholder="Digite o seu e-mail"
        error={erroEmail}
      />

      <AuthAlert mensagem={erro} />

      <AuthSubmitButton carregando={carregando} textoCarregando="Enviando código...">
        Enviar código de recuperação
      </AuthSubmitButton>
    </form>
  );
}

export default RequestCodeForm;