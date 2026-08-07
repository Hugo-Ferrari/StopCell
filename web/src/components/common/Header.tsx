import { matchPath, useLocation } from "react-router-dom";


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

  const titulo = matchPath(
    { path: "/ordemServico/:numOs", end: true },
    location.pathname
  )
    ? "Diagnóstico e Orçamento"
    : titulos[location.pathname] || "Stop Cell";

  return (
    <>

      <header
        className=" sticky top-0 z-10 flex h-20 items-center border-b border-border bg-background/95 px-5 backdrop-blur-sm transition-all duration-300 lg:pl-72
        ">
        <div className="flex flex-col">
          <span className="text-xs font-extrabold uppercase tracking-widest lg:text-sm">
            <span className="text-foreground">
              ST<span className="text-primary">O</span>P
            </span>

            <span className="text-primary">CELL</span>
          </span>

          <h1 className="text-lg font-bold text-foreground lg:text-2xl">
            {titulo}
          </h1>
        </div>
      </header>
    </>
  );
}

export default Header;