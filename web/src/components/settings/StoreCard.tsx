import { Building2, Hash, MapPin, Pencil, Phone, Store } from "lucide-react";
import InfoItem from "@/components/common/InfoItem";
import { Button } from "@/components/ui/button";
import { formatarCnpj, formatarTelefone } from "@/utils/masks";
import type { EmpresaDTO } from "@/services/enterpriseService";

interface StoreCardProps {
  store: EmpresaDTO;
  onEditar: () => void;
}

export default function StoreCard({ store, onEditar }: StoreCardProps) {
  return (
    <section className="flex w-full flex-col gap-5 rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Store size={22} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-semibold text-foreground">{store.nomeFantasia || "Nome da loja"}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Essas informações são impressas nas ordens de serviço</p>
          </div>
        </div>

        <Button variant="outline" onClick={onEditar} className="h-10 w-full rounded-xl px-5 sm:w-auto">
          <Pencil className="size-4" /> Editar dados
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 border-t border-border pt-5 md:grid-cols-2">
        <InfoItem icon={<Building2 size={18} />} label="Nome fantasia" valor={store.nomeFantasia || "Não informado"} />
        <InfoItem icon={<Building2 size={18} />} label="Razão social" valor={store.razaoSocial || "Não informada"} />
        <InfoItem icon={<Hash size={18} />} label="CNPJ" valor={store.cnpj ? formatarCnpj(store.cnpj) : "Não informado"} />
        <InfoItem
          icon={<Phone size={18} />}
          label="Telefone / WhatsApp"
          valor={store.telefone ? formatarTelefone(store.telefone) : "Não informado"}
        />
        <InfoItem
          icon={<MapPin size={18} />}
          label="Endereço"
          valor={store.endereco || "Não informado"}
          className="md:col-span-2"
        />
      </div>
    </section>
  );
}
