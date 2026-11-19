import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { obterToken, removerToken, tokenVencido } from "@/api/token";

function RequireLogin({ children }: { children: ReactNode }) {
  const token = obterToken();

  if (!token) return <Navigate to="/" replace />;

  if (tokenVencido(token)) {
    removerToken();
    return <Navigate to="/?sessao=expirada" replace />;
  }

  return <>{children}</>;
}

export default RequireLogin;
