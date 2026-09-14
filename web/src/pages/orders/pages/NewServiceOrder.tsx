import { useState } from "react";
import { User, UserPlus, CheckCircle2, XCircle } from "lucide-react";
import type { criarClienteDto } from "@/services/customerService";

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
  const [toast, setToast] = useState<{ visivel: boolean; msg: string; tipo: "sucesso" | "erro" }>({ visivel: false, msg: "", tipo: "sucesso" });

  function mostrarToast(msg: string, tipo: "sucesso" | "erro") {
    setToast({ visivel: true, msg, tipo });
    setTimeout(() => setToast({ visivel: false, msg: "", tipo: "sucesso" }), 4000);
  }

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6 relative mx-auto mt-8">
      
      {/* Pop-up de Toast */}
      {toast.visivel && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all animate-in slide-in-from-top-5 ${toast.tipo === "sucesso" ? "bg-green-500/10 border border-green-500/50 text-green-500" : "bg-red-500/10 border border-red-500/50 text-red-500"}`}>
          {toast.tipo === "sucesso" ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
          <span className="font-bold text-sm">{toast.msg}</span>
        </div>
      )}

      {/* Navegação das Abas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button type="button" onClick={() => setAbaAtiva("existente")} className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-medium transition-all ${abaAtiva === "existente" ? "bg-[#F25C38] text-white" : "bg-[#141414] border border-[#222222] text-zinc-400 hover:text-white"}`}>
          <User size={20} /> Cliente Existente
        </button>
        <button type="button" onClick={() => setAbaAtiva("novo")} className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-medium transition-all ${abaAtiva === "novo" ? "bg-[#F25C38] text-white" : "bg-[#141414] border border-[#222222] text-zinc-400 hover:text-white"}`}>
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