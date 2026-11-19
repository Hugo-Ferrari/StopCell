import { AtSign, Briefcase, Crown, Mail, Pencil, User } from "lucide-react";
import InfoItem from "@/components/common/InfoItem";
import { Button } from "@/components/ui/button";
import { iniciais } from "@/utils/iniciais";
import type { UsuarioLogado } from "@/services/userService";

interface ProfileCardProps {
  usuario: UsuarioLogado;
  onEditar?: () => void;
}

export default function ProfileCard({ usuario, onEditar }: ProfileCardProps) {
  const cargo = usuario.ehDono ? "Administrador" : (usuario.perfil?.nome ?? "Sem perfil");

  return (
    <section className="flex w-full flex-col gap-5 rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {iniciais(usuario.nome)}
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-semibold text-foreground">{usuario.nome || "Sem nome"}</h2>
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
          <Button variant="outline" onClick={onEditar} className="h-10 w-full rounded-xl px-5 sm:w-auto">
            <Pencil className="size-4" /> Editar dados
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground sm:max-w-60 sm:text-right">
            Para alterar seus dados, fale com o administrador da loja.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 border-t border-border pt-5 md:grid-cols-2">
        <InfoItem icon={<User size={18} />} label="Nome" valor={usuario.nome || "Não informado"} />
        <InfoItem icon={<AtSign size={18} />} label="Usuário (login)" valor={usuario.login || "Não informado"} />
        <InfoItem icon={<Mail size={18} />} label="E-mail" valor={usuario.emailUsuario || "Não informado"} />
        <InfoItem icon={<Briefcase size={18} />} label="Cargo" valor={cargo} />
      </div>
    </section>
  );
}
