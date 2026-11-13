import { AtSign, Briefcase, Crown, Mail, Pencil, User } from "lucide-react";
import InfoItem from "@/components/common/InfoItem";
import { iniciais } from "@/utils/iniciais";
import type { UsuarioLogado } from "@/services/userService";

interface ProfileCardProps {
  usuario: UsuarioLogado;
  onEditar?: () => void;
}

export default function ProfileCard({ usuario, onEditar }: ProfileCardProps) {
  const cargo = usuario.ehDono ? "Administrador" : (usuario.perfil?.nome ?? "Sem perfil");

  return (
    <div className="w-full rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
            {iniciais(usuario.nome)}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-foreground">
              {usuario.nome || "Sem nome"}
            </h2>
            {usuario.ehDono ? (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                <Crown size={12} /> Administrador
              </span>
            ) : (
              <span className="mt-1 inline-flex rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {cargo}
              </span>
            )}
          </div>
        </div>

        {onEditar ? (
          <button
            type="button"
            onClick={onEditar}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-accent sm:w-auto"
          >
            <Pencil size={16} /> Editar dados
          </button>
        ) : (
          <p className="text-xs text-muted-foreground sm:max-w-56 sm:text-right">
            Para alterar seus dados, fale com o administrador da loja.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 pt-5 sm:grid-cols-2">
        <InfoItem icon={<User size={18} />} label="Nome" valor={usuario.nome || "Não informado"} />
        <InfoItem icon={<AtSign size={18} />} label="Usuário (login)" valor={usuario.login || "Não informado"} />
        <InfoItem icon={<Mail size={18} />} label="E-mail" valor={usuario.emailUsuario || "Não informado"} />
        <InfoItem icon={<Briefcase size={18} />} label="Cargo" valor={cargo} />
      </div>
    </div>
  );
}
