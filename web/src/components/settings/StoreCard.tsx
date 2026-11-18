import { Store, Phone, MapPin, Building2, Hash, Pencil } from "lucide-react";
import InfoItem from "@/components/common/InfoItem";
import { formatarCnpj, formatarTelefone } from "@/utils/masks";
import type { EmpresaDTO } from "@/services/enterpriseService";

interface StoreCardProps {
  store: EmpresaDTO;
  onEditar: () => void;
}

export default function StoreCard({ store, onEditar }: StoreCardProps) {
  return (
    <div className="w-full rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Store size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {store.nomeFantasia || "Nome da Loja"}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Essas informações são impressas nas Ordens de Serviço
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEditar}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-accent sm:w-auto"
        >
          <Pencil size={16} /> Editar dados
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 pt-5 sm:grid-cols-2">
        <InfoItem
          icon={<Building2 size={18} />}
          label="Nome Fantasia"
          valor={store.nomeFantasia || "Não informado"}
        />
        <InfoItem
          icon={<Building2 size={18} />}
          label="Razão Social"
          valor={store.razaoSocial || "Não informada"}
        />
        <InfoItem
          icon={<Hash size={18} />}
          label="CNPJ"
          valor={store.cnpj ? formatarCnpj(store.cnpj) : "Não informado"}
        />
        <InfoItem
          icon={<Phone size={18} />}
          label="Telefone / WhatsApp"
          valor={store.telefone ? formatarTelefone(store.telefone) : "Não informado"}
        />
        <InfoItem
          icon={<MapPin size={18} />}
          label="Endereço"
          valor={store.endereco || "Não informado"}
          className="sm:col-span-2"
        />
      </div>
    </div>
  );
}
