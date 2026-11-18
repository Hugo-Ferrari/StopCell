import { type ComponentProps, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthSubmitButtonProps extends Omit<ComponentProps<typeof Button>, "children"> {
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
    <Button
      type={type}
      // trava enquanto carrega pra não mandar a requisição duas vezes
      disabled={disabled || carregando}
      aria-busy={carregando}
      className="h-12 w-full rounded-xl px-8"
      {...props}
    >
      {carregando ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {textoCarregando}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

export default AuthSubmitButton;
