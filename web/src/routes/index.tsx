import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import RecuperarSenha from "../pages/RecuperarSenha";
import OrdemServico from "../pages/OrdemServico";
import Financeiro from "../pages/Financeiro";
import NovaOrdemServico from "../pages/NovaOrdemServico";
import DetalhesOrdemServico from "../pages/DetalhesOrdemServico";
import MainLayout from "@/layouts/MainLayout";
import Historico from "@/pages/Historico";

export function AppRoutes(){
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/recuperarSenha" element={<RecuperarSenha />} />

            <Route element={<MainLayout/>}>
                <Route
                    path="/ordemServico"element={<OrdemServico />}/>

                <Route
                    path="/financeiro"element={<Financeiro />}/>

                <Route
                    path="/nova-ordem-servico"element={<NovaOrdemServico />}/>

                <Route
                    path="/ordemServico/:numOs" element={<DetalhesOrdemServico />} />

                <Route
                    path="/historico" element={<Historico/>}>
                    
                </Route>
            </Route>

        </Routes>
    );
}