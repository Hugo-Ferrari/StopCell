import { Search, X } from "lucide-react";

interface BuscaOsProps {
  valor: string;
  onChange: (valor: string) => void;
}

function BuscaOs({ valor, onChange }: BuscaOsProps) {
  return (
    <div className="flex flex-1 items-center rounded-2xl border border-border bg-card px-3 py-1 transition-colors focus-within:border-primary md:px-4 md:py-1.5">
      <Search size={18} className="mr-2 shrink-0 text-muted-foreground md:mr-3" />
      <input
        type="search"
        placeholder="Buscar O.S., cliente, aparelho ou IMEI..."
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent p-2 text-sm text-foreground outline-none placeholder:text-muted-foreground md:text-base [&::-webkit-search-cancel-button]:hidden"
      />
      {valor && (
        <button
          type="button"
          aria-label="Limpar busca"
          onClick={() => onChange("")}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default BuscaOs;