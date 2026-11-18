import { Crown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UsuarioDaLoja } from "@/services/userService";
import { iniciais } from "@/utils/iniciais";

interface UserListProps {
  usuarios: UsuarioDaLoja[];
  onEditar: (usuario: UsuarioDaLoja) => void;
}

function UserList({ usuarios, onEditar }: UserListProps) {
  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
      {usuarios.map((u) => (
        <li key={u.idUsuario} className="flex items-center gap-3 p-4 sm:gap-4">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              u.ativo ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
            }`}
          >
            {iniciais(u.nome)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className={`truncate font-semibold ${u.ativo ? "text-foreground" : "text-muted-foreground"}`}>
                {u.nome || "Sem nome"}
              </p>

              {u.ehDono ? (
                <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  <Crown size={12} /> Administrador
                </span>
              ) : (
                <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {u.perfil?.nome ?? "Sem perfil"}
                </span>
              )}

              {!u.ativo && (
                <span className="rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                  Inativo
                </span>
              )}
            </div>
            <p className="truncate text-xs text-muted-foreground sm:text-sm">{u.emailUsuario}</p>
          </div>

          {/* o dono não aparece com editar: ele sempre tem acesso total */}
          {!u.ehDono && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEditar(u)}
              aria-label={`Editar ${u.nome}`}
              className="size-9 shrink-0 rounded-xl text-muted-foreground"
            >
              <Pencil className="size-4" />
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default UserList;