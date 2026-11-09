import type { PermissaoCatalogo } from "@/services/perfilService";
import { alternarPermissao } from "@/utils/permissoes";

interface PermissionChecklistProps {
  catalogo: PermissaoCatalogo[];
  selecionadas: string[];
  onChange: (permissoes: string[]) => void;
}

function PermissionChecklist({ catalogo, selecionadas, onChange }: PermissionChecklistProps) {
  // junta as permissões por grupo (Ordens, Histórico...) mantendo a ordem do back
  const grupos = catalogo.reduce<Record<string, PermissaoCatalogo[]>>((acc, p) => {
    (acc[p.grupo] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(grupos).map(([grupo, permissoes]) => (
        <fieldset key={grupo} className="rounded-lg border border-border p-3 sm:p-4">
          <legend className="px-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {grupo}
          </legend>

          <div className="flex flex-col gap-1">
            {permissoes.map((p) => {
              const marcada = selecionadas.includes(p.chave);
              return (
                <label
                  key={p.chave}
                  className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50"
                >
                  <input
                    type="checkbox"
                    checked={marcada}
                    onChange={() => onChange(alternarPermissao(selecionadas, p.chave))}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--primary)]"
                  />
                  <span className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{p.nome}</span>
                    <span className="text-xs text-muted-foreground">{p.descricao}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

export default PermissionChecklist;