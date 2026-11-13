import type { ReactNode } from "react";
import { Lock } from "lucide-react";

interface EtapaBloqueadaProps {
  bloqueada: boolean;
  aviso: string;
  children: ReactNode;
}

export default function EtapaBloqueada({ bloqueada, aviso, children }: EtapaBloqueadaProps) {
  if (!bloqueada) return <>{children}</>;

  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-center gap-2 px-1 text-xs font-medium text-muted-foreground">
        <Lock size={14} /> {aviso}
      </p>
      <div className="cursor-not-allowed" title={aviso}>
        <fieldset disabled aria-disabled className="pointer-events-none select-none opacity-50">
          {children}
        </fieldset>
      </div>
    </div>
  );
}
