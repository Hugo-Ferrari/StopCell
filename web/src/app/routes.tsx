import { Route, Routes } from "react-router-dom";
import Login from "@/pages/auth/pages/Login";
import RecuperarSenha from "@/pages/auth/pages/RecoverPassword";
import Register from "@/pages/auth/pages/Register";
import OrdemServico from "@/pages/orders/pages/WorkOrder";
import Financeiro from "@/pages/finance/Financial";
import NovaOrdemServico from "@/pages/orders/pages/NewServiceOrder";
import DetalhesOrdemServico from "@/pages/orders/pages/ServiceOrderDetails";
import MainLayout from "@/layouts/MainLayout";
import Historico from "@/pages/history/History";
import Estoque from "@/pages/orders/pages/Stock";
import Configuracoes from "@/pages/settings/Settings";
import StoreSettings from "@/pages/settings/StoreSettings";
import UsersSettings from "@/components/settings/UsersSettings";
import RequirePermissao from "@/components/common/RequirePermissao";
import { PERMISSOES } from "@/utils/permissoes";

const { ORDENS_VER, ORDENS_EDITAR, HISTORICO_VER, ESTOQUE_VER, FINANCEIRO_VER, LOJA_EDITAR } = PERMISSOES;

export function AppRoutes() {
  return (
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
          path="/historico"
          element={
            <RequirePermissao permissoes={[HISTORICO_VER]}>
              <Historico />
            </RequirePermissao>
          }
        />
        <Route
          path="/estoque"
          element={
            <RequirePermissao permissoes={[ESTOQUE_VER]}>
              <Estoque />
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
  );
}