import type { ReactNode } from "react";

interface SecaoTituloProps {
  children: ReactNode;
  acao?: ReactNode;
}

// título pequeno em caixa alta que separa os blocos dentro das abas
function SecaoTitulo({ children, acao }: SecaoTituloProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">{children}</h3>
      {acao}
    </div>
  );
}

export default SecaoTitulo;