import { LogOut } from "lucide-react";
import { sairDoSistema } from "@/api/token";
import { useUsuario } from "@/hooks/useUsuario";
import { cn } from "@/lib/utils";

interface UsuarioMenuProps {
  // menu recolhido no desktop: mostra só a inicial e o ícone de sair
  compacto: boolean;
}

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

// rodapé do menu lateral: quem está logado e o botão de sair
function UsuarioMenu({ compacto }: UsuarioMenuProps) {
  const { usuario, ehDono } = useUsuario();

  const nome = usuario?.nome || usuario?.login || "Usuário";
  const papel = ehDono ? "Dono" : (usuario?.perfil?.nome ?? "Funcionário");

  return (
    <div className={cn("flex shrink-0 items-center gap-3 border-t border-border p-3", compacto && "flex-col")}>
      <span
        title={compacto ? `${nome} · ${papel}` : undefined}
        className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary"
      >
        {iniciais(nome)}
      </span>

      {!compacto && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{nome}</p>
          <p className="truncate text-xs text-muted-foreground">{papel}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => sairDoSistema("saiu")}
        title="Sair"
        aria-label="Sair do sistema"
        className="flex size-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
}

export default UsuarioMenu;