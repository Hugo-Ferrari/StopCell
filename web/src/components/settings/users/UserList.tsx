import { Crown, Pencil } from "lucide-react";
import type { UsuarioDaLoja } from "@/services/userService";

interface UserListProps {
  usuarios: UsuarioDaLoja[];
  onEditar: (usuario: UsuarioDaLoja) => void;
}

// pega as iniciais pro "avatar" (Yasmim Ferreira -> YF)
function iniciais(nome: string | null) {
  if (!nome) return "?";
  const partes = nome.trim().split(/\s+/);
  return (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : "")).toUpperCase();
}

function UserList({ usuarios, onEditar }: UserListProps) {
  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
      {usuarios.map((u) => (
        <li key={u.idUsuario} className="flex items-center gap-3 p-4 sm:gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
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
            <button
              type="button"
              onClick={() => onEditar(u)}
              aria-label={`Editar ${u.nome}`}
              className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Pencil size={16} />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default UserList;