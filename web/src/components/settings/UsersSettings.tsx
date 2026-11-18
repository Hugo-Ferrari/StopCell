import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import Alert from "@/components/common/Alert";
import UserList from "@/components/settings/users/UserList";
import UserFormModal from "@/components/settings/users/UserFormModal";
import ProfileList from "@/components/settings/users/ProfileList";
import ProfileFormModal from "@/components/settings/users/ProfileFormModal";
import ExcluirPerfilDialog from "@/components/settings/users/ExcluirPerfilDialog";
import DicaDesativado from "@/components/common/DicaDesativado";
import type { PerfilAcesso } from "@/services/perfilService";
import type { UsuarioDaLoja } from "@/services/userService";
import { useUsersSettings } from "./hooks/useUsersSettings";

type Aba = "usuarios" | "perfis";

// undefined = modal fechado, null = criando, objeto = editando
type ModalUsuario = UsuarioDaLoja | null | undefined;
type ModalPerfil = PerfilAcesso | null | undefined;

export default function UsersSettings() {
  const { usuarios, perfis, catalogo, carregando, erro, salvarPerfil, salvarUsuario, excluirPerfil } =
    useUsersSettings();

  const [aba, setAba] = useState<Aba>("usuarios");
  const [modalUsuario, setModalUsuario] = useState<ModalUsuario>(undefined);
  const [modalPerfil, setModalPerfil] = useState<ModalPerfil>(undefined);
  const [perfilExcluindo, setPerfilExcluindo] = useState<PerfilAcesso | null>(null);

  if (carregando) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const semPerfis = perfis.length === 0;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* o título já aparece no Header, aqui fica só a explicação */}
        <p className="text-sm text-muted-foreground">
          Cadastre os funcionários da loja e defina o que cada um pode acessar.
        </p>

        {aba === "usuarios" ? (
          <DicaDesativado
            mensagem={semPerfis ? "Crie um perfil de acesso primeiro, na aba Perfis de acesso." : null}
            className="w-full sm:w-auto"
          >
            <button
              type="button"
              onClick={() => setModalUsuario(null)}
              disabled={semPerfis}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={18} /> Novo usuário
            </button>
          </DicaDesativado>
        ) : (
          <button
            type="button"
            onClick={() => setModalPerfil(null)}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Plus size={18} /> Novo perfil
          </button>
        )}
      </div>

      <div role="tablist" className="flex gap-1 rounded-xl border border-border bg-card p-1 sm:w-fit">
        {(
          [
            ["usuarios", `Usuários (${usuarios.length})`],
            ["perfis", `Perfis de acesso (${perfis.length})`],
          ] as const
        ).map(([valor, rotulo]) => (
          <button
            key={valor}
            type="button"
            role="tab"
            aria-selected={aba === valor}
            onClick={() => setAba(valor)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:flex-none ${
              aba === valor ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {rotulo}
          </button>
        ))}
      </div>

      <Alert mensagem={erro} />

      {aba === "usuarios" ? (
        <>
          {semPerfis && (
            <p className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              Para cadastrar funcionários, crie antes um perfil de acesso na aba{" "}
              <button type="button" onClick={() => setAba("perfis")} className="font-semibold text-primary hover:underline">
                Perfis de acesso
              </button>
              .
            </p>
          )}
          <UserList usuarios={usuarios} onEditar={setModalUsuario} />
        </>
      ) : (
        <ProfileList perfis={perfis} catalogo={catalogo} onEditar={setModalPerfil} onExcluir={setPerfilExcluindo} />
      )}

      {/* o key faz o formulário começar limpo toda vez que abre */}
      {modalUsuario !== undefined && (
        <UserFormModal
          key={modalUsuario?.idUsuario ?? "novo"}
          usuario={modalUsuario ?? undefined}
          perfis={perfis}
          onFechar={() => setModalUsuario(undefined)}
          onSalvar={(dados) => salvarUsuario(dados, modalUsuario?.idUsuario)}
        />
      )}

      <ExcluirPerfilDialog
        perfil={perfilExcluindo}
        onFechar={() => setPerfilExcluindo(null)}
        onConfirmar={excluirPerfil}
      />

      {modalPerfil !== undefined && (
        <ProfileFormModal
          key={modalPerfil?.idPerfil ?? "novo"}
          perfil={modalPerfil ?? undefined}
          catalogo={catalogo}
          onFechar={() => setModalPerfil(undefined)}
          onSalvar={(dados) => salvarPerfil(dados, modalPerfil?.idPerfil)}
        />
      )}
    </div>
  );
}