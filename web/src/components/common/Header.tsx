import { matchPath, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

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

  const titulo =
    matchPath({ path: "/ordemServico/:numOs", end: true }, location.pathname)
      ? "Diagnóstico e Orçamento"
      : titulos[location.pathname] || "Stop Cell";

  return (
    <header className="flex items-center border-b border-border bg-background/95 p-5 backdrop-blur-sm">
      <NavBar />

      <div className="ml-10">
        <span className="relative text-2xl font-extrabold uppercase leading-tight tracking-wide">
          <div className="text-sm">
            <span className="text-foreground">
              ST<span className="text-primary">O</span>P
            </span>

            <span className="text-primary">
              CELL
            </span>
          </div>
        </span>

        <h1 className="text-xl font-bold text-foreground">
          {titulo}
        </h1>
      </div>

    </header>
  );
}

export default Header;