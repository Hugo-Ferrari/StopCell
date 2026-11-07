// essa tela é exibida depois que o usuário redefiniu a senha com sucesso
import { CircleCheck } from "lucide-react";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";

interface ResetSuccessProps {
  onIrParaLogin: () => void;
}

function ResetSuccess({ onIrParaLogin }: ResetSuccessProps) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <CircleCheck className="h-14 w-14 text-[var(--success)]" strokeWidth={1.75} />
      <AuthSubmitButton type="button" onClick={onIrParaLogin}>
        Ir para o login
      </AuthSubmitButton>
    </div>
  );
}

export default ResetSuccess;