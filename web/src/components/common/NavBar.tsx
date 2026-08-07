import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ClipboardList,
  Menu,
  RotateCcw,
  Settings,
  Van,
  Wallet,
  X,
} from "lucide-react";


function NavBar() {
  const location = useLocation();

  const [aberta, setAberta] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;

      setIsDesktop(desktop);

      if (desktop) {
        setAberta(true);
      } else {
        setAberta(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarAberta = isDesktop || aberta;

  const fecharMenu = () => {
    if (!isDesktop) {
      setAberta(false);
    }
  };

  const menuItens = [
    {
      icon: <ClipboardList size={20} />,
      text: "Ordens de Serviço",
      subtext: "Cadastre e acompanhe serviços",
      path: "/ordemServico",
    },
    {
      icon: <RotateCcw size={20} />,
      text: "Histórico",
      subtext: "Visualize serviços anteriores",
      path: "/historico",
    },
    {
      icon: <Van size={20} />,
      text: "Fornecedores",
      subtext: "Cadastre fornecedores",
      path: "/fornecedores",
    },
    {
      icon: <Wallet size={20} />,
      text: "Financeiro",
      subtext: "Receitas e despesas",
      path: "/financeiro",
    },
    {
      icon: <Settings size={20} />,
      text: "Configurações",
      subtext: "Personalize o sistema",
      path: "/configuracoes",
    },
  ];

  return (
    <>

      {!isDesktop && aberta && (
        <div
          onClick={() => setAberta(false)}
          className="fixed inset-0 z-40 bg-black/50"
        />
      )}


      {!isDesktop && (
        <button
          onClick={() => setAberta(true)}
          className="fixed left-4 top-5 z-50 rounded-lg bg-card p-2 shadow-md"
        >
          <Menu size={22} />
        </button>
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-border bg-card shadow-xl transition-all duration-300 ${sidebarAberta ? "w-64" : "w-0 overflow-hidden"} `}
      >

        <div className="flex items-center justify-between border-b border-border p-5">


          {!isDesktop && (
            <button
              onClick={() => setAberta(false)}
              className="rounded-lg p-2 hover:bg-accent"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {menuItens.map((item) => {
            const ativo = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={fecharMenu}
                className={` mb-2 flex items-center gap-4 rounded-xl p-3 transition-all
                  ${ativo
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                  }
                `}
              >
                <div
                  className={
                    ativo
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {item.icon}
                </div>

                <div>
                  <p className="font-semibold">{item.text}</p>

                  <p
                    className={`text-xs ${ativo
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                      }`}
                  >
                    {item.subtext}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default NavBar;