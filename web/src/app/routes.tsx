import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "@/pages/auth/pages/Login";
import MainLayout from "@/layouts/MainLayout";
import RequirePermissao from "@/components/common/RequirePermissao";
import CarregandoTela from "@/components/common/CarregandoTela";
import { PERMISSOES } from "@/utils/permissoes";

// o login é a primeira tela, então já vem junto; as outras só baixam quando abrem
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
const ProfileSettings = lazy(() => import("@/pages/settings/ProfileSettings"));
const UsersSettings = lazy(() => import("@/components/settings/UsersSettings"));

const { ORDENS_VER, ORDENS_EDITAR, HISTORICO_VER, FINANCEIRO_VER, LOJA_EDITAR } = PERMISSOES;

export function AppRoutes() {
  return (
    <Suspense fallback={<CarregandoTela telaCheia />}>
      <Routes>
        {/* rotas pub*/}
        <Route path="/" element={<Login />} />
        <Route path="/recuperarSenha" element={<RecuperarSenha />} />
        <Route path="/cadastro" element={<Register />} />

        {/* rotas priv */}
        <Route element={<MainLayout />}>
          {/* o login sempre cai aqui, então quem não tem acesso é levado pra outra tela */}
          <Route
            path="/ordemServico"
            element={
              <RequirePermissao permissoes={[ORDENS_VER]} redirecionar>
                <OrdemServico />
              </RequirePermissao>
            }
          />
          <Route
            path="/nova-ordem-servico"
            element={
              <RequirePermissao permissoes={[ORDENS_EDITAR]}>
                <NovaOrdemServico />
              </RequirePermissao>
            }
          />
          <Route
            path="/ordemServico/:numOs"
            element={
              <RequirePermissao permissoes={[ORDENS_VER, HISTORICO_VER]}>
                <DetalhesOrdemServico />
              </RequirePermissao>
            }
          />
          <Route
            path="/ordemServico/:numOs/checklist"
            element={
              <RequirePermissao permissoes={[ORDENS_EDITAR]}>
                <ChecklistEntrada />
              </RequirePermissao>
            }
          />
          <Route
            path="/historico"
            element={
              <RequirePermissao permissoes={[HISTORICO_VER]}>
                <Historico />
              </RequirePermissao>
            }
          />
          <Route
            path="/financeiro"
            element={
              <RequirePermissao permissoes={[FINANCEIRO_VER]}>
                <Financeiro />
              </RequirePermissao>
            }
          />

          {/* configurações: qualquer um entra, cada card decide se aparece */}
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route
            path="/configuracoes/loja"
            element={
              <RequirePermissao permissoes={[LOJA_EDITAR]}>
                <StoreSettings />
              </RequirePermissao>
            }
          />
          {/* qualquer usuário logado vê o próprio perfil (editar, só o dono) */}
          <Route path="/configuracoes/perfil" element={<ProfileSettings />} />
          <Route
            path="/configuracoes/usuarios"
            element={
              <RequirePermissao somenteDono>
                <UsersSettings />
              </RequirePermissao>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}
