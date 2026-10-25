import type { OrdemServicoInterface } from "@/pages/history/History";

export function getStatusStyle(status: OrdemServicoInterface["status"]) {
  if (status === "DIAGNOSTICO")
    return {
      bg: "bg-yellow-500/10 border-yellow-500/30",
      text: "text-yellow-500",
      dot: "bg-yellow-500",
      label: "Em Diag.",
    };
  if (status === "EM_REPARO")
    return {
      bg: "bg-blue-400/10 border-blue-400/30",
      text: "text-blue-400",
      dot: "bg-blue-400",
      label: "Em Reparo",
    };
  if (status === "FINALIZADO")
    return {
      bg: "bg-green-500/10 border-green-500/30",
      text: "text-green-500",
      dot: "bg-green-500",
      label: "Finalizado",
    };
  return {
    bg: "bg-muted border-border",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
    label: "Aguard. Peça",
  };
}
