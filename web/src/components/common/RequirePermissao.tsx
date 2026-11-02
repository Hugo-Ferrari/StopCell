import { type ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Loader2, ShieldOff } from "lucide-react";
import { useUsuario } from "@/hooks/useUsuario";
import { MENU_ITENS } from "@/config/menuItens";
import type { Permissao } from "@/utils/permissoes";

interface RequirePermissaoProps {
  children: ReactNode;
  /** basta ter uma delas */
  permissoes?: Permissao[];
  somenteDono?: boolean;
  /** se não tiver acesso, leva direto pra primeira tela permitida em vez de mostrar o aviso */
  redirecionar?: boolean;
}

// Protege a rota no front. O back também bloqueia, isso aqui é pra
// o funcionário não cair numa tela que só ia dar erro ao carregar.
function RequirePermissao({
  children,
  permissoes = [],
  somenteDono = false,
  redirecionar = false,
}: RequirePermissaoProps) {
  const { carregando, ehDono, pode } = useUsuario();
  const location = useLocation();

  if (carregando) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const liberado = somenteDono ? ehDono : permissoes.length === 0 || pode(...permissoes);
  if (liberado) return <>{children}</>;

  const primeiraPermitida = MENU_ITENS.find(
    (item) => item.path !== location.pathname && (!item.permissoes || pode(...item.permissoes)),
  );

  // ex: o login sempre manda pra /ordemServico, mas o funcionário pode só ter
  // acesso ao estoque. aí em vez de mostrar o aviso, já leva ele pra lá
  if (redirecionar && primeiraPermitida) {
    return <Navigate to={primeiraPermitida.path} replace />;
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center">
      <ShieldOff className="h-10 w-10 text-muted-foreground" />
      <div>
        <h2 className="text-lg font-bold text-foreground">Acesso restrito</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Seu perfil não tem permissão para acessar esta tela. Se precisar, fale com o
          administrador da loja.
        </p>
      </div>
      {primeiraPermitida && (
        <Link
          to={primeiraPermitida.path}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Ir para {primeiraPermitida.text}
        </Link>
      )}
    </div>
  );
}

export default RequirePermissao;