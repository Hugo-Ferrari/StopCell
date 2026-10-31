// É o fundo da página, o link “Voltar para o login” e a coluna centralizada. Depois dá para usar no Register também.
import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface AuthPageLayoutProps {
  children: ReactNode;
  mostrarVoltar?: boolean;
}

function AuthPageLayout({ children, mostrarVoltar = true }: AuthPageLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-x-hidden bg-background px-4 py-6 text-foreground md:py-10">
      {mostrarVoltar && (
        <div className="mb-6 flex w-full max-w-md justify-start">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <ArrowLeft size={18} />
            <span>Voltar para o login</span>
          </Link>
        </div>
      )}

      <main className="flex w-full max-w-md flex-col">{children}</main>
    </div>
  );
}

export default AuthPageLayout;