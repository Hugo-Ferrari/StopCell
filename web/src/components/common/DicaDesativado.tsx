import type { ReactNode } from "react";

interface DicaDesativadoProps {
  mensagem?: string | null;
  children: ReactNode;
  className?: string;
}

// botão desativado não recebe o mouse, então quem mostra a dica é o span de fora
function DicaDesativado({ mensagem, children, className = "" }: DicaDesativadoProps) {
  if (!mensagem) return <>{children}</>;

  return (
    <span
      className={`group relative inline-flex cursor-not-allowed [&>button:disabled]:pointer-events-none ${className}`}
      aria-label={mensagem}
    >
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute top-full right-0 z-20 mt-2 w-max max-w-64 rounded-lg border border-border bg-popover px-3 py-2 text-xs font-medium text-popover-foreground opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
      >
        {mensagem}
      </span>
    </span>
  );
}

export default DicaDesativado;
