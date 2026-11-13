import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Alert from "@/components/common/Alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PerfilAcesso } from "@/services/perfilService";
import { mensagemDeErro } from "@/utils/apiError";

interface ExcluirPerfilDialogProps {
  perfil: PerfilAcesso | null;
  onFechar: () => void;
  onConfirmar: (perfil: PerfilAcesso) => Promise<void>;
}

function ExcluirPerfilDialog({ perfil, onFechar, onConfirmar }: ExcluirPerfilDialogProps) {
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function fechar() {
    if (excluindo) return;
    setErro(null);
    onFechar();
  }

  async function handleExcluir() {
    if (!perfil) return;
    setExcluindo(true);
    setErro(null);

    try {
      await onConfirmar(perfil);
      setErro(null);
      onFechar();
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível excluir o perfil."));
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <Dialog
      open={perfil !== null}
      onOpenChange={(abrir) => {
        if (!abrir) fechar();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir o perfil "{perfil?.nome}"?</DialogTitle>
          <DialogDescription>
            Essa ação não pode ser desfeita. Se precisar dele de novo, será preciso criar outro perfil.
          </DialogDescription>
        </DialogHeader>

        <Alert mensagem={erro} />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={fechar}
            disabled={excluindo}
            className="h-12 rounded-2xl text-base font-semibold"
          >
            Voltar
          </Button>
          <Button
            onClick={handleExcluir}
            disabled={excluindo}
            className="h-12 rounded-2xl bg-destructive text-base font-semibold text-white hover:bg-destructive/90"
          >
            {excluindo && <Loader2 className="animate-spin" />}
            Excluir perfil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExcluirPerfilDialog;
