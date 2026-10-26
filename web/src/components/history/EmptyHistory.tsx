import { SearchX } from "lucide-react";

interface EmptyHistoryProps {
  title: string;
  description: string;
}

export default function EmptyHistory({ title, description }: EmptyHistoryProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
      <SearchX className="mx-auto mb-3 text-muted-foreground" size={28} />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
