import { useState } from "react";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Alert from "@/components/common/Alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { atualizarStatusOs } from "@/services/serviceOrderService";
import { mensagemDeErro } from "@/utils/apiError";

interface CancelarOsDialogProps {
  numOs: number;
  onCancelada: () => Promise<void>;
}

// cancelar não tem volta, então pede confirmação antes
function CancelarOsDialog({ numOs, onCancelada }: CancelarOsDialogProps) {
  const [aberto, setAberto] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleCancelar() {
    setCancelando(true);
    setErro(null);

    try {
      await atualizarStatusOs(numOs, "CANCELADO");
      setAberto(false);
      await onCancelada();
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível cancelar a O.S."));
    } finally {
      setCancelando(false);
    }
  }

  return (
    <Dialog
      open={aberto}
      onOpenChange={(abrir) => {
        setAberto(abrir);
        if (abrir) setErro(null);
      }}
    >
      <DialogTrigger className="flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
        <XCircle className="size-4" /> Cancelar O.S.
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar a O.S. #{numOs}?</DialogTitle>
          <DialogDescription>
            Use quando o cliente desistir do conserto. Depois de cancelada, a O.S. não pode mais ser
            editada nem reaberta.
          </DialogDescription>
        </DialogHeader>

        <Alert mensagem={erro} />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setAberto(false)}
            className="h-12 rounded-2xl text-base font-semibold"
          >
            Voltar
          </Button>
          <Button
            onClick={handleCancelar}
            disabled={cancelando}
            className="h-12 rounded-2xl bg-destructive text-base font-semibold text-white hover:bg-destructive/90"
          >
            {cancelando && <Loader2 className="animate-spin" />}
            Cancelar O.S.
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CancelarOsDialog;