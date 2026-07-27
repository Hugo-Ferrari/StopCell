
import { useLocation } from "react-router-dom";
import NavBar from "./navBar";

function Header() {
  const location = useLocation();

  const titulos: Record<string, string> = {
    "/ordemServico": "Ordens de Serviço",
    "/nova-ordem-servico": "Nova Ordem de Serviço",
    "/financeiro": "Financeiro",
    "/historico": "Histórico",
    "/fornecedores": "Fornecedores",
    "/configuracoes": "Configurações",
  };

  const titulo = titulos[location.pathname] || "Stop Cell";

  return (
    <header className="flex items-center  p-5  border-b bg-black ">
        

      <NavBar/>
        

      <div className="ml-10">
        <span className="relative text-2xl font-extrabold uppercase leading-tight tracking-wide">
            <div className="text-sm">

                <span className=" text-white">
                    ST<span className="text-orange-500">O</span>P
                </span>
                <span className=" text-orange-500">CELL</span>
            </div>
            </span>

        <h1 className="text-xl font-bold text-white">
          {titulo}
        </h1>
      </div>

    </header>
  );
}

export default Header;