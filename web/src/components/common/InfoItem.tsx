import type { ReactNode } from "react";

interface InfoItemProps {
  icon: ReactNode;
  label: string;
  valor: string;
  className?: string;
}

function InfoItem({ icon, label, valor, className = "" }: InfoItemProps) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 break-words text-sm font-medium text-foreground">{valor}</p>
      </div>
    </div>
  );
}

export default InfoItem;
