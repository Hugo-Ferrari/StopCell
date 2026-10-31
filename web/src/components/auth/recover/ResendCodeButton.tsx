// Botão de reenviar
interface ResendCodeButtonProps {
  onClick: () => void;
  segundosRestantes: number;
  desabilitado?: boolean;
}

function ResendCodeButton({ onClick, segundosRestantes, desabilitado }: ResendCodeButtonProps) {
  const aguardando = segundosRestantes > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={aguardando || desabilitado}
      className="cursor-pointer rounded-md text-sm font-semibold text-primary transition-colors hover:text-[#e04f2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
    >
      {aguardando ? `Reenviar código em ${segundosRestantes}s` : "Reenviar código"}
    </button>
  );
}

export default ResendCodeButton;