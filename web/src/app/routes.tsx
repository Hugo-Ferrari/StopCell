import { Route, Routes } from "react-router-dom";
import Login from "@/pages/auth/pages/Login";
import RecuperarSenha from "@/pages/auth/pages/RecoverPassword";
import OrdemServico from "@/pages/orders/pages/WorkOrder";
import Financeiro from "@/pages/finance/Financial";
import NovaOrdemServico from "@/pages/orders/pages/NewServiceOrder";
import DetalhesOrdemServico from "@/pages/orders/pages/ServiceOrderDetails";
import MainLayout from "@/layouts/MainLayout";
import Historico from "@/pages/history/History";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/recuperarSenha" element={<RecuperarSenha />} />

      <Route element={<MainLayout />}>
        <Route path="/ordemServico" element={<OrdemServico />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/nova-ordem-servico" element={<NovaOrdemServico />} />
        <Route path="/ordemServico/:numOs" element={<DetalhesOrdemServico />} />
        <Route path="/historico" element={<Historico />} />
      </Route>
    </Routes>
  );
}