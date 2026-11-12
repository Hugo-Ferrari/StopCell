import { useState } from "react";
import { User, UserPlus } from "lucide-react";
import type { criarClienteDto } from "@/services/customerService";
import Toast from "@/components/common/Toast";
import { useToast } from "@/hooks/useToast";

// Importando os componentes menores lá da pasta steps
import ExistingCustomer from "@/components/orders/steps/ExistingCustomer";
import NewCustomer from "@/components/orders/steps/NewCustomer";

export default function NewServiceOrder() {
  const [abaAtiva, setAbaAtiva] = useState<"existente" | "novo">("existente");
  
  // O pai guarda quem é o cliente selecionado para repassar aos filhos
  const [clienteSelecionado, setClienteSelecionado] = useState<criarClienteDto>({
    nmCompleto: "", cpf: "", telefone: "", email: "", endereco: "", aparelhos: []
  });

  // Notificações centrais
  const { toast, mostrarToast } = useToast();

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6 relative mx-auto">

      <Toast mensagem={toast?.mensagem} tipo={toast?.tipo} />

      {/* Navegação das Abas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button type="button" onClick={() => setAbaAtiva("existente")} className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-medium transition-all ${abaAtiva === "existente" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
          <User size={20} /> Cliente Existente
        </button>
        <button type="button" onClick={() => setAbaAtiva("novo")} className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-medium transition-all ${abaAtiva === "novo" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
          <UserPlus size={20} /> Cadastrar novo cliente
        </button>
      </div>

      
      {abaAtiva === "existente" && (
        <ExistingCustomer 
          mostrarToast={mostrarToast} 
          clienteSelecionado={clienteSelecionado} 
          setClienteSelecionado={setClienteSelecionado} 
        />
      )}

      {abaAtiva === "novo" && (
        <NewCustomer 
          mostrarToast={mostrarToast} 
          setAbaAtiva={setAbaAtiva} 
          setClienteSelecionado={setClienteSelecionado} 
        />
      )}
      
    </div>
  );
}