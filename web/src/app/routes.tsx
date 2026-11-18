import { lazy, Suspense, type ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Login from "@/pages/auth/pages/Login";
import MainLayout from "@/layouts/MainLayout";
import RequirePermissao from "@/components/common/RequirePermissao";
import { PERMISSOES } from "@/utils/permissoes";

// cada tela vira um arquivo separado e só baixa quando alguém abre.
// o financeiro, com os gráficos, era o que mais pesava pra todo mundo
const RecuperarSenha = lazy(() => import("@/pages/auth/pages/RecoverPassword"));
const Register = lazy(() => import("@/pages/auth/pages/Register"));
const OrdemServico = lazy(() => import("@/pages/orders/pages/WorkOrder"));
const Financeiro = lazy(() => import("@/pages/finance/Financial"));
const NovaOrdemServico = lazy(() => import("@/pages/orders/pages/NewServiceOrder"));
const DetalhesOrdemServico = lazy(() => import("@/pages/orders/pages/ServiceOrderDetails"));
const ChecklistEntrada = lazy(() => import("@/pages/orders/pages/EntryChecklist"));
const Historico = lazy(() => import("@/pages/history/History"));
const Configuracoes = lazy(() => import("@/pages/settings/Settings"));
const StoreSettings = lazy(() => import("@/pages/settings/StoreSettings"));
const UsersSettings = lazy(() => import("@/components/settings/UsersSettings"));

const { ORDENS_VER, ORDENS_EDITAR, HISTORICO_VER, FINANCEIRO_VER, LOJA_EDITAR } = PERMISSOES;

// o carregando fica dentro da tela, então o menu não some enquanto ela baixa
function Tela({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-7 animate-spin text-primary" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* rotas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/recuperarSenha" element={<Tela><RecuperarSenha /></Tela>} />
      <Route path="/cadastro" element={<Tela><Register /></Tela>} />

      {/* rotas privadas */}
      <Route element={<MainLayout />}>
        {/* o login sempre cai aqui, então quem não tem acesso é levado pra outra tela */}
        <Route
          path="/ordemServico"
          element={
            <RequirePermissao permissoes={[ORDENS_VER]} redirecionar>
              <Tela><OrdemServico /></Tela>
            </RequirePermissao>
          }
        />
        <Route
          path="/nova-ordem-servico"
          element={
            <RequirePermissao permissoes={[ORDENS_EDITAR]}>
              <Tela><NovaOrdemServico /></Tela>
            </RequirePermissao>
          }
        />
        <Route
          path="/ordemServico/:numOs"
          element={
            <RequirePermissao permissoes={[ORDENS_VER, HISTORICO_VER]}>
              <Tela><DetalhesOrdemServico /></Tela>
            </RequirePermissao>
          }
        />
        <Route
          path="/ordemServico/:numOs/checklist"
          element={
            <RequirePermissao permissoes={[ORDENS_EDITAR]}>
              <Tela><ChecklistEntrada /></Tela>
            </RequirePermissao>
          }
        />
        <Route
          path="/historico"
          element={
            <RequirePermissao permissoes={[HISTORICO_VER]}>
              <Tela><Historico /></Tela>
            </RequirePermissao>
          }
        />
        <Route
          path="/financeiro"
          element={
            <RequirePermissao permissoes={[FINANCEIRO_VER]}>
              <Tela><Financeiro /></Tela>
            </RequirePermissao>
          }
        />

        {/* configurações: qualquer um entra, cada card decide se aparece */}
        <Route path="/configuracoes" element={<Tela><Configuracoes /></Tela>} />
        <Route
          path="/configuracoes/loja"
          element={
            <RequirePermissao permissoes={[LOJA_EDITAR]}>
              <Tela><StoreSettings /></Tela>
            </RequirePermissao>
          }
        />
        <Route
          path="/configuracoes/usuarios"
          element={
            <RequirePermissao somenteDono>
              <Tela><UsersSettings /></Tela>
            </RequirePermissao>
          }
        />
      </Route>
    </Routes>
  );
}