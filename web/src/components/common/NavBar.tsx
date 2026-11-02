import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { MENU_ITENS } from "@/config/menuItens";
import { useUsuario } from "@/hooks/useUsuario";

interface NavBarProps {
  /** só vale no desktop: menu fininho, só com os ícones */
  recolhido: boolean;
  onAlternar: () => void;
}

function NavBar({ recolhido, onAlternar }: NavBarProps) {
  const location = useLocation();
  const { pode, carregando } = useUsuario();

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

  // no celular o menu é a gaveta que abre por cima, então nunca fica recolhido
  const compacto = isDesktop && recolhido;

  const fecharMenu = () => {
    if (!isDesktop) {
      setAberta(false);
    }
  };

  // esconde o que o perfil do usuário não libera
  // (enquanto carrega o usuário, não mostra nada pra não "piscar" itens proibidos)
  const menuItens = carregando
    ? []
    : MENU_ITENS.filter((item) => !item.permissoes || pode(...item.permissoes));

  const larguraAside = !sidebarAberta ? "w-0 overflow-hidden" : compacto ? "w-20" : "w-64";

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
          aria-label="Abrir menu"
          className="fixed left-4 top-5 z-50 rounded-lg bg-card p-2 shadow-md"
        >
          <Menu size={22} />
        </button>
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-border bg-card shadow-xl transition-all duration-300 ${larguraAside}`}
      >

        <div
          className={`flex h-20 shrink-0 items-center border-b border-border px-5 ${
            compacto ? "justify-center" : "justify-end"
          }`}
        >
          {isDesktop ? (
            <button
              onClick={onAlternar}
              aria-label={recolhido ? "Expandir menu" : "Recolher menu"}
              title={recolhido ? "Expandir menu" : "Recolher menu"}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {recolhido ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
          ) : (
            <button
              onClick={() => setAberta(false)}
              aria-label="Fechar menu"
              className="rounded-lg p-2 hover:bg-accent"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          {menuItens.map((item) => {
            const ativo = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={fecharMenu}
                // recolhido, o nome aparece quando passa o mouse
                title={compacto ? item.text : undefined}
                aria-label={compacto ? item.text : undefined}
                className={` mb-2 flex items-center rounded-xl p-3 transition-all
                  ${compacto ? "justify-center" : "gap-4"}
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

                {!compacto && (
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{item.text}</p>

                    <p
                      className={`text-xs ${ativo
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                        }`}
                    >
                      {item.subtext}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default NavBar;