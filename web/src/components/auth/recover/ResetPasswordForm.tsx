// esse formulário é usado na tela de redefinir senha, depois que o usuário já recebeu o código por e-mail
import { useState, type FormEvent } from "react";
import { KeyRound, Lock } from "lucide-react";
import FormInput from "@/components/common/FormInput";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import AuthAlert from "@/components/auth/AuthAlert";
import { TAMANHO_CODIGO, TAMANHO_MINIMO_SENHA } from "./constants";

export interface ResetPasswordValues {
  codigo: string;
  novaSenha: string;
}

interface ResetPasswordFormProps {
  onSubmit: (valores: ResetPasswordValues) => void;
  carregando: boolean;
  erro?: string | null;
}

function ResetPasswordForm({ onSubmit, carregando, erro }: ResetPasswordFormProps) {
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [confirmarTocado, setConfirmarTocado] = useState(false);

  const codigoCompleto = codigo.length === TAMANHO_CODIGO;
  const senhaValida = novaSenha.length >= TAMANHO_MINIMO_SENHA;
  const senhasIguais = novaSenha === confirmarSenha;

  const erroConfirmar =
    confirmarTocado && confirmarSenha.length > 0 && !senhasIguais
      ? "As senhas não coincidem"
      : undefined;

  const formularioValido = codigoCompleto && senhaValida && senhasIguais;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setConfirmarTocado(true);
    if (!formularioValido) return;
    onSubmit({ codigo, novaSenha });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <FormInput
        label="Código recebido"
        inputSize="lg"
        icon={<KeyRound size={18} />}
        type="text"
        name="codigo"
        // abre teclado numérico no celular e deixa o sistema sugerir o código
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        required
        maxLength={TAMANHO_CODIGO}
        value={codigo}
        // aceita só número, até 6 dígitos (se colar com espaço também funciona)
        onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, TAMANHO_CODIGO))}
        placeholder="000000"
        className="tracking-[0.4em]"
      />

      <FormInput
        label="Nova senha"
        inputSize="lg"
        icon={<Lock size={18} />}
        type="password"
        name="novaSenha"
        autoComplete="new-password"
        required
        minLength={TAMANHO_MINIMO_SENHA}
        value={novaSenha}
        onChange={(e) => setNovaSenha(e.target.value)}
        placeholder={`Mínimo ${TAMANHO_MINIMO_SENHA} caracteres`}
      />

      <FormInput
        label="Confirmar nova senha"
        inputSize="lg"
        icon={<Lock size={18} />}
        type="password"
        name="confirmarSenha"
        autoComplete="new-password"
        required
        value={confirmarSenha}
        onChange={(e) => setConfirmarSenha(e.target.value)}
        onBlur={() => setConfirmarTocado(true)}
        placeholder="Repita a nova senha"
        error={erroConfirmar}
      />

      <AuthAlert mensagem={erro} />

      <AuthSubmitButton carregando={carregando} textoCarregando="Redefinindo..." disabled={!formularioValido}>
        Redefinir senha
      </AuthSubmitButton>
    </form>
  );
}

export default ResetPasswordForm;