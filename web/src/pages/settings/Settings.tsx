import { Store, User, Users } from "lucide-react";
import SettingCard from "@/components/settings/SettingCard";
import { useUsuario } from "@/hooks/useUsuario";
import { PERMISSOES } from "@/utils/permissoes";

export function Settings() {
  const { ehDono, pode } = useUsuario();

  return (
    <div className="flex flex-col w-full gap-6">
      {/* o título já aparece no Header, aqui fica só a explicação */}
      <p className="text-sm text-muted-foreground">
        Gerencie as configurações da sua conta e da loja
      </p>

      {/* Lista de configurações: cada card em sua própria linha */}
      <div className="flex flex-col gap-3.5 sm:gap-4 w-full">
        {/* 1. Dados da Loja: só aparece pra quem pode editar */}
        {pode(PERMISSOES.LOJA_EDITAR) && (
          <SettingCard
            title="Dados da Loja"
            description="Informações da sua loja, contato, logo e endereço."
            icon={Store}
            to="/configuracoes/loja"
          />
        )}

        {/* 2. Usuários e permissões: só o dono gerencia */}
        {ehDono && (
          <SettingCard
            title="Usuários e Permissões"
            description="Cadastre funcionários e defina o que cada um pode acessar."
            icon={Users}
            to="/configuracoes/usuarios"
          />
        )}

        {/* 3. Meu Perfil */}
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