import { Suspense, useEffect, useState } from "react";
import Header from "@/components/common/Header";
import CarregandoTela from "@/components/common/CarregandoTela";
import NavBar from "@/components/common/NavBar";
import { Outlet } from "react-router-dom";
import { UsuarioProvider } from "@/context/usuarioProvider";

const CHAVE_MENU = "menuRecolhido";

function MainLayout() {
  // o estado fica aqui (e não no NavBar) porque o conteúdo também precisa saber
  // a largura do menu pra ajustar a margem da esquerda
  const [recolhido, setRecolhido] = useState(() => localStorage.getItem(CHAVE_MENU) === "1");

  // lembra a escolha quando recarregar a página
  useEffect(() => {
    localStorage.setItem(CHAVE_MENU, recolhido ? "1" : "0");
  }, [recolhido]);

  return (
    // o provider fica aqui porque só as telas de dentro do sistema precisam do usuário logado
    <UsuarioProvider>
      <div className="min-h-screen bg-background ">
        <NavBar recolhido={recolhido} onAlternar={() => setRecolhido((r) => !r)} />

        <div className={`transition-all duration-300 ${recolhido ? "lg:ml-20" : "lg:ml-64"}`}>
          <Header />

          <main className="p-4 transition-all duration-300 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              {/* fica aqui dentro pra o menu e o cabeçalho não piscarem enquanto a tela baixa */}
              <Suspense fallback={<CarregandoTela />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </UsuarioProvider>
  );
}

export default MainLayout;