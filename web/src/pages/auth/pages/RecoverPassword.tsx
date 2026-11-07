import { useNavigate } from "react-router-dom";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthAlert from "@/components/auth/AuthAlert";
import RequestCodeForm from "@/components/auth/recover/RequestCodeForm";
import ResetPasswordForm from "@/components/auth/recover/ResetPasswordForm";
import RecoveryHelpCard from "@/components/auth/recover/RecoveryHelpCard";
import ResendCodeButton from "@/components/auth/recover/ResendCodeButton";
import ResetSuccess from "@/components/auth/recover/ResetSuccess";
import { useRecoverPassword } from "@/hooks/useRecoverPassword";

function RecuperarSenha() {
  const navigate = useNavigate();
  const {
    etapa,
    email,
    setEmail,
    carregando,
    erro,
    aviso,
    segundosParaReenvio,
    solicitarCodigo,
    reenviarCodigo,
    confirmarNovaSenha,
    trocarEmail,
  } = useRecoverPassword();

  if (etapa === "sucesso") {
    return (
      <AuthPageLayout mostrarVoltar={false}>
        <AuthHeader titulo="Senha redefinida" descricao="Pronto! Agora é só entrar com a sua nova senha." />
        <div className="mt-10">
          <ResetSuccess onIrParaLogin={() => navigate("/")} />
        </div>
      </AuthPageLayout>
    );
  }

  if (etapa === "codigo") {
    return (
      <AuthPageLayout>
        <AuthHeader
          titulo="Digite o código"
          descricao={
            <>
              Enviamos um código para <strong className="text-foreground">{email}</strong>.
              Digite-o abaixo e escolha sua nova senha.{" "}
              <button
                type="button"
                onClick={trocarEmail}
                className="cursor-pointer text-primary underline-offset-4 hover:underline"
              >
                Trocar e-mail
              </button>
            </>
          }
        />

        <div className="mt-10 flex flex-col gap-8">
          <ResetPasswordForm onSubmit={confirmarNovaSenha} carregando={carregando} erro={erro} />

          <AuthAlert mensagem={aviso} tipo="sucesso" />

          <RecoveryHelpCard
            acao={
              <ResendCodeButton
                onClick={reenviarCodigo}
                segundosRestantes={segundosParaReenvio}
                desabilitado={carregando}
              />
            }
          />
        </div>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout>
      <AuthHeader
        titulo="Recupere o acesso à sua conta"
        descricao="Digite seu e-mail cadastrado que enviaremos um código para redefinir sua senha"
      />

      <div className="mt-10 flex flex-col gap-8">
        <RequestCodeForm
          email={email}
          onEmailChange={setEmail}
          onSubmit={solicitarCodigo}
          carregando={carregando}
          erro={erro}
        />

        <RecoveryHelpCard />
      </div>
    </AuthPageLayout>
  );
}

export default RecuperarSenha;