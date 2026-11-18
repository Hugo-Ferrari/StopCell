import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
      <SearchX className="size-10 text-muted-foreground" />
      <div>
        <h2 className="text-lg font-bold text-foreground">Página não encontrada</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          O endereço que você abriu não existe ou foi trocado. Confira o link ou volte para o início.
        </p>
      </div>
      <Link to="/ordemServico" className={cn(buttonVariants(), "h-10 rounded-xl px-5")}>
        Ir para o início
      </Link>
    </div>
  );
}

export default NotFound;
