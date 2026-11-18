import type { MouseEvent } from "react";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function telaAnterior(pathname: string): string | null {
  const checklist = matchPath({ path: "/ordemServico/:numOs/checklist", end: true }, pathname);
  if (checklist) return `/ordemServico/${checklist.params.numOs}`;

  if (matchPath({ path: "/ordemServico/:numOs", end: true }, pathname)) return "/ordemServico";
  if (pathname === "/nova-ordem-servico") return "/ordemServico";
  if (pathname.startsWith("/configuracoes/")) return "/configuracoes";

  return null;
}

function VoltarLink() {
  const location = useLocation();
  const navigate = useNavigate();
  const destino = telaAnterior(location.pathname);

  if (!destino) return null;

  function voltar(e: MouseEvent<HTMLAnchorElement>) {
    if (location.key === "default") return;
    e.preventDefault();
    navigate(-1);
  }

  return (
    <Link
      to={destino}
      onClick={voltar}
      aria-label="Voltar para a tela anterior"
      title="Voltar"
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "size-9 shrink-0 rounded-xl text-muted-foreground hover:text-foreground lg:size-10",
      )}
    >
      <ArrowLeft className="size-5" />
    </Link>
  );
}

export default VoltarLink;
