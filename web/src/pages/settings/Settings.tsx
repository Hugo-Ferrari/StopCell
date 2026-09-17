import {
  Store,
  User,
  MessageSquare,
  Printer,
  ShieldCheck,
} from "lucide-react";
import SettingCard from "@/components/settings/SettingCard";

export function Settings() {
  return (
    <div className="flex flex-col w-full gap-6">
      {/* Cabeçalho da página */}
      <div>
        <span className="text-[#F25C38] text-[10px] md:text-xs font-bold uppercase tracking-widest">
          Stop Cell
        </span>
        <h1 className="text-2xl md:text-3xl font-bold mt-1 text-white">
          Configurações
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
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
          iconColorClass="text-[#F25C38] bg-[#F25C38]/10 border-[#F25C38]/20"
          onClick={() => {
            // Futuro redirecionamento para Dados da Loja
          }}
        />

        {/* 2. Meu Perfil */}
        <SettingCard
          title="Meu Perfil"
          description="Gerencie seus dados pessoais, login, e-mail e cargo."
          icon={User}
          iconColorClass="text-sky-400 bg-sky-500/10 border-sky-500/20"
          onClick={() => {
            // Futuro redirecionamento para Perfil (Yasmim)
          }}
        />

        {/* 3. Templates WhatsApp */}
        <SettingCard
          title="Templates WhatsApp"
          description="Edite as mensagens padrão que você envia aos clientes."
          icon={MessageSquare}
          iconColorClass="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
          onClick={() => {
            // Futuro redirecionamento para Templates WhatsApp
          }}
        />

        {/* 4. Impressora Térmica */}
        <SettingCard
          title="Impressora Térmica"
          description="Configure sua impressora e defina o modelo de impressão."
          icon={Printer}
          iconColorClass="text-purple-400 bg-purple-500/10 border-purple-500/20"
          onClick={() => {
            // Futuro redirecionamento para Impressora Térmica
          }}
        />

        {/* 5. Segurança & Acesso */}
        <SettingCard
          title="Segurança & Acesso"
          description="Alteração de senha e controle de permissões de usuário."
          icon={ShieldCheck}
          iconColorClass="text-amber-400 bg-amber-500/10 border-amber-500/20"
          onClick={() => {
            // Futuro redirecionamento para Segurança
          }}
        />
      </div>
    </div>
  );
}

export default Settings;
