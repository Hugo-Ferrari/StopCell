import { Store, Phone, MapPin, Building2 } from "lucide-react";
import { formatarCnpj, formatarTelefone } from "@/utils/masks";
import type { EmpresaDTO } from "@/services/enterpriseService";

interface StoreCardProps {
  store: EmpresaDTO;
}

export default function StoreCard({ store }: StoreCardProps) {
  return (
    <div className="w-full rounded-xl border border-border bg-card p-5 sm:p-6 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-border">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Store size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-foreground">
                {store.nomeFantasia || "Nome da Loja"}
              </h3>
              <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-400">
                Ativa
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {store.razaoSocial || "Razão Social não informada"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building2 size={16} className="text-primary shrink-0" />
          <span className="truncate">
            {store.cnpj ? formatarCnpj(store.cnpj) : "CNPJ não informado"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone size={16} className="text-primary shrink-0" />
          <span className="truncate">
            {store.telefone ? formatarTelefone(store.telefone) : "Telefone não informado"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={16} className="text-primary shrink-0" />
          <span className="truncate" title={store.endereco || ""}>
            {store.endereco || "Endereço não informado"}
          </span>
        </div>
      </div>
    </div>
  );
}
