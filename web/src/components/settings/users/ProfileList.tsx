import { Pencil, ShieldCheck, Trash2, Users } from "lucide-react";
import type { PerfilAcesso, PermissaoCatalogo } from "@/services/perfilService";
import DicaDesativado from "@/components/common/DicaDesativado";
import { Button } from "@/components/ui/button";

interface ProfileListProps {
  perfis: PerfilAcesso[];
  catalogo: PermissaoCatalogo[];
  onEditar: (perfil: PerfilAcesso) => void;
  onExcluir: (perfil: PerfilAcesso) => void;
}

function ProfileList({ perfis, catalogo, onEditar, onExcluir }: ProfileListProps) {
  if (perfis.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <ShieldCheck className="mx-auto size-8 text-muted-foreground" />
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
          <div key={perfil.idPerfil} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-foreground">{perfil.nome}</h3>
                {perfil.descricao && (
                  <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{perfil.descricao}</p>
                )}
              </div>

              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditar(perfil)}
                  aria-label={`Editar perfil ${perfil.nome}`}
                  className="size-9 rounded-xl text-muted-foreground"
                >
                  <Pencil className="size-4" />
                </Button>
                <DicaDesativado
                  mensagem={emUso ? "Esse perfil está em uso. Troque o perfil dos usuários antes de excluir." : null}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onExcluir(perfil)}
                    disabled={emUso}
                    aria-label={`Excluir perfil ${perfil.nome}`}
                    className="size-9 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </DicaDesativado>
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