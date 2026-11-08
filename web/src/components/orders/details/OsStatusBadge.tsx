import { Badge } from "@/components/ui/badge";
import { estiloStatus } from "@/utils/statusOs";
import type { StatusOs } from "@/types/ordemServico";

interface OsStatusBadgeProps {
  status: StatusOs;
}

function OsStatusBadge({ status }: OsStatusBadgeProps) {
  const estilo = estiloStatus(status);

  return (
    <Badge variant="outline" className={`${estilo.bg} ${estilo.text}`}>
      <span className={`size-1.5 rounded-full ${estilo.dot}`} />
      {estilo.label}
    </Badge>
  );
}

export default OsStatusBadge;