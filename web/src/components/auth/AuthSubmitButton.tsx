import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface AuthSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  carregando?: boolean;
  textoCarregando?: string;
  children: ReactNode;
}

function AuthSubmitButton({
  carregando = false,
  textoCarregando = "Enviando...",
  disabled,
  children,
  type = "submit",
  ...props
}: AuthSubmitButtonProps) {
  return (
    <button
      type={type}
      // trava enquanto carrega pra não mandar a requisição duas vezes
      disabled={disabled || carregando}
      aria-busy={carregando}
      className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-background transition-colors hover:bg-[#e04f2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {carregando ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          {textoCarregando}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default AuthSubmitButton;