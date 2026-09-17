import { Store, User } from "lucide-react";
import SettingCard from "@/components/settings/SettingCard";

export function Settings() {
  return (
    <div className="flex flex-col w-full gap-6">
      {/* Cabeçalho da página */}
      <div>
        <span className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
          Stop Cell
        </span>
        <h1 className="text-2xl md:text-3xl font-bold mt-1 text-foreground">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie as configurações da sua conta e da loja
        </p>
      </div>

      {/* Lista de configurações: cada card em sua própria linha */}
      <div className="flex flex-col gap-3.5 sm:gap-4 w-full">
        {/* 1. Dados da Loja */}
        <SettingCard
          title="Dados da Loja"
          description="Informações da sua loja, contato, logo e endereço."
          icon={Store}
          to="/configuracoes/loja"
        />

        {/* 2. Meu Perfil */}
        <SettingCard
          title="Meu Perfil"
          description="Gerencie seus dados pessoais, login, e-mail e cargo."
          icon={User}
          to="/configuracoes/perfil"
        />

      </div>
    </div>
  );
}

export default Settings;

