import { matchPath, useLocation } from "react-router-dom";
import ThemeToggle from "@/components/common/ThemeToggle";

function Header() {
  const location = useLocation();

  const titulos: Record<string, string> = {
    "/ordemServico": "Ordens de Serviço",
    "/nova-ordem-servico": "Nova Ordem de Serviço",
    "/financeiro": "Financeiro",
    "/historico": "Histórico",
    "/fornecedores": "Fornecedores",
    "/configuracoes": "Configurações",
    "/configuracoes/loja": "Dados da Loja",
    "/configuracoes/usuarios": "Usuários e Permissões", // <- novo

  };

   // rotas com parâmetro não entram no objeto de cima, por isso o matchPath
  const titulo = matchPath({ path: "/ordemServico/:numOs/checklist", end: true }, location.pathname)
    ? "Checklist de Entrada"
    : matchPath({ path: "/ordemServico/:numOs", end: true }, location.pathname)
      ? "Diagnóstico e Orçamento"
      : titulos[location.pathname] || "Stop Cell";

  return (
    <>

      <header className="sticky top-0 z-10 flex h-20 items-center justify-between gap-4 border-b border-border bg-background/95 px-5 pl-16 backdrop-blur-sm transition-all duration-300 lg:px-8">
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

        <ThemeToggle />
      </header>
    </>
  );
}

export default Header;