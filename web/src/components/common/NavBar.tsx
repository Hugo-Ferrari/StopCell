import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [aberta, setAberta] = useState(false);
  const [isDesktop, setIsDescktop] = useState(window.innerWidth >=1024)

  useEffect(() =>{
    const handleResize = () =>{
      setIsDescktop(window.innerWidth >=1024)
    }
    window.addEventListener("resize" , handleResize)
    return () =>{
      window.removeEventListener("resize", handleResize)
    }
  },[])

  const close =()=> {
    if(!isDesktop)
      setAberta(false)
}
  const menuItens = [
  
    {
      icon: <ClipboardList size={20} />,
      text: "Ordem de Serviço",
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
      subtext: "Cadastre e gerencie fornecedores",
      path: "/fornecedores",
    },
    {
      icon: <Wallet size={20} />,
      text: "Financeiro",
      subtext: "Controle receitas e despesas",
      path: "/financeiro",
    },
    {
      icon: <Settings size={20} />,
      text: "Configurações",
      subtext: "Personalize o sistema",
      path: "/configuracoes",
    },
  ];

    
    const sidebarAberta = isDesktop || aberta
  return (
    <aside
      className={`fixed top-0 left-0 z-50 py-3 overflow-hidden  text-foreground  transition-all duration-300 
        ${sidebarAberta ? "h-screen bg-card  w-60" : "h-15 w-15"
      }`}
    >
      <button
        onClick={() => setAberta((prev) => !prev)}
        className={`flex p-4 transition-colors hover:text-primary ${
          sidebarAberta
            ? "w-full justify-end"
            : "justify-center rotate-180"
        }`}
      >
        {sidebarAberta ? <X /> : <Menu />}
      </button>

      <nav className="px-2">
        {menuItens.map((item) => (
          <Link
          onClick={close}
            key={item.text}
            to={item.path}
            className="group mb-2 flex items-center gap-4 rounded-xl p-3 transition-all hover:bg-accent"
          >
            {sidebarAberta && (
              <div className="flex flex-col">
                <div className="text-muted-foreground transition-colors group-hover:text-primary">
                  {item.icon}
                </div>

                <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                  {item.text}
                </span>

                <span className="text-xs text-muted-foreground">
                  {item.subtext}
                </span>
              </div>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default NavBar;