import { Pencil, ShieldCheck, Trash2, Users } from "lucide-react";
import type { PerfilAcesso, PermissaoCatalogo } from "@/services/perfilService";

interface ProfileListProps {
  perfis: PerfilAcesso[];
  catalogo: PermissaoCatalogo[];
  onEditar: (perfil: PerfilAcesso) => void;
  onExcluir: (perfil: PerfilAcesso) => void;
}

function ProfileList({ perfis, catalogo, onEditar, onExcluir }: ProfileListProps) {
  if (perfis.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 font-semibold text-foreground">Nenhum perfil criado</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Crie perfis como "Técnico" ou "Atendente" para definir o que cada funcionário pode acessar.
        </p>
      </div>
    );
  }

  // mostra o nome bonitinho da permissão em vez da chave (ordens.ver)
  const nomeDa = (chave: string) => catalogo.find((p) => p.chave === chave)?.nome ?? chave;

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {perfis.map((perfil) => {
        const emUso = perfil.totalUsuarios > 0;

        return (
          <div key={perfil.idPerfil} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-bold text-foreground">{perfil.nome}</h3>
                {perfil.descricao && (
                  <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{perfil.descricao}</p>
                )}
              </div>

              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => onEditar(perfil)}
                  aria-label={`Editar perfil ${perfil.nome}`}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onExcluir(perfil)}
                  disabled={emUso}
                  aria-label={`Excluir perfil ${perfil.nome}`}
                  title={emUso ? "Troque o perfil dos usuários antes de excluir" : undefined}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {perfil.permissoes.map((chave) => (
                <span
                  key={chave}
                  className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  {nomeDa(chave)}
                </span>
              ))}
            </div>

            <p className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users size={14} />
              {perfil.totalUsuarios === 1 ? "1 usuário" : `${perfil.totalUsuarios} usuários`}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default ProfileList;