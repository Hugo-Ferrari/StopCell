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

export function AppRoutes() {
  return (
    <Routes>
      {/* rotas pub*/}
      <Route path="/" element={<Login />} />
      <Route path="/recuperarSenha" element={<RecuperarSenha />} />
      <Route path="/cadastro" element={<Register />} />

      {/* rotas priv */}
      <Route element={<MainLayout />}>
        <Route path="/ordemServico" element={<OrdemServico />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/nova-ordem-servico" element={<NovaOrdemServico />} />
        <Route path="/ordemServico/:numOs" element={<DetalhesOrdemServico />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/configuracoes/loja" element={<StoreSettings />} />
      </Route>
    </Routes>
  );
}