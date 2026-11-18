import { useState } from "react";
import { Loader2, RotateCw } from "lucide-react";
import Alert from "@/components/common/Alert";
import TelaSemDados from "@/components/common/TelaSemDados";
import { Button } from "@/components/ui/button";
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
    return (
      <TelaSemDados
        titulo="Não foi possível carregar seus dados"
        descricao="Recarregue a página para tentar de novo."
        acao={
          <Button onClick={() => window.location.reload()} className="h-10 rounded-xl px-5">
            <RotateCw className="size-4" /> Recarregar a página
          </Button>
        }
      />
    );
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
