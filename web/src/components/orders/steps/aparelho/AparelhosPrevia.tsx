import { Plus, Smartphone } from "lucide-react";

export default function AparelhosPrevia() {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 md:p-8">
      <div className="mb-5 flex flex-col gap-1">
        <h2 className="flex items-center gap-2 font-bold text-foreground">
          <Smartphone size={18} /> 2. Aparelho
        </h2>
        <p className="text-sm text-muted-foreground">
          Escolha um aparelho que o cliente já trouxe ou cadastre um novo.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="min-h-[104px] rounded-2xl border border-border bg-background" />
        <div className="flex min-h-[104px] items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-4 font-semibold text-muted-foreground">
          <Plus className="size-5" /> Novo aparelho
        </div>
      </div>
    </div>
  );
}
