import { useState } from "react";
import { Loader2 } from "lucide-react";
import Alert from "@/components/common/Alert";
import ProfileCard from "@/components/settings/profile/ProfileCard";
import ProfileForm from "@/components/settings/profile/ProfileForm";
import { useUsuario } from "@/hooks/useUsuario";
import { atualizarUsuario, type AtualizarMeuPerfilDTO } from "@/services/userService";

export default function ProfileSettings() {
  const { usuario, carregando, ehDono, recarregar } = useUsuario();
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState("");

  async function handleSalvar(dados: AtualizarMeuPerfilDTO) {
    if (!usuario) return;
    setSalvando(true);
    try {
      await atualizarUsuario(usuario.idUsuario, dados);
      await recarregar();
      setEditando(false);
      setSucesso("Seus dados foram atualizados com sucesso!");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!usuario) {
    return <Alert mensagem="Não foi possível carregar seus dados. Tente recarregar a página." />;
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 pb-10">
      {editando ? (
        <ProfileForm
          usuario={usuario}
          onSalvar={handleSalvar}
          salvando={salvando}
          onCancelar={() => setEditando(false)}
        />
      ) : (
        <>
          <Alert mensagem={sucesso} tipo="sucesso" />
          <ProfileCard
            usuario={usuario}
            onEditar={
              ehDono
                ? () => {
                    setSucesso("");
                    setEditando(true);
                  }
                : undefined
            }
          />
        </>
      )}
    </div>
  );
}
