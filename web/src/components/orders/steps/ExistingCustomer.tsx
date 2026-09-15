import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { criarClienteDto } from "@/services/customerService";
import { criarOrdemServico } from "@/services/serviceOrderService";

import CustomerSearch from "./CustomerSearch";
import DeviceForm from "./DeviceForm";
import ChecklistForm, { ITENS_CHECKLIST } from "./ChecklistForm";

interface ExistingCustomerProps {
  mostrarToast: (msg: string, tipo: "sucesso" | "erro") => void;
  clienteSelecionado: criarClienteDto;
  setClienteSelecionado: (cliente: criarClienteDto) => void;
}

export default function ExistingCustomer({ mostrarToast, clienteSelecionado, setClienteSelecionado }: ExistingCustomerProps) {
  const [imeiAparelhoValidado, setImeiAparelhoValidado] = useState<string | null>(null);
  const [gerandoOs, setGerandoOs] = useState(false);
  const [idDoAtendente, setIdDoAtendente] = useState<number | null>(null);

  const [dadosChecklist, setDadosChecklist] = useState({
    tecnico: "",
    osAnterior: "",
    relato: "",
    itens: ITENS_CHECKLIST.map(nome => ({ nome, status: null as "OK" | "NOK" | "NA" | null, obs: "" }))
  });

  useEffect(() => {
    try {
      const token = 
        localStorage.getItem("token") || 
        localStorage.getItem("access_token") || 
        sessionStorage.getItem("token") || 
        sessionStorage.getItem("access_token") || 
        sessionStorage.getItem("jwt");

      console.log("Token encontrado:", token);

      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("Payload do Token:", payload);

        const idEncontrado = 
          payload.idUsuario ?? 
          payload.id_usuario ?? 
          payload.id ?? 
          payload.sub ?? 
          payload.userId;

        if (idEncontrado) {
          console.log("ID do Atendente identificado:", idEncontrado);
          setIdDoAtendente(Number(idEncontrado));
        } else {
          console.warn("Atributo de ID nao encontrado no payload do token.");
        }
      } else {
        console.warn("Nenhum token encontrado em localStorage/sessionStorage.");
      }
    } catch (erro) {
      console.error("Erro ao ler token de autenticacao:", erro);
    }
  }, []);

  async function handleGerarOSFinal() {
    if (!clienteSelecionado?.cpf || !imeiAparelhoValidado) return;

    if (!idDoAtendente) {
      return mostrarToast("Sessao invalida ou ID do atendente nao encontrado. Faca login novamente.", "erro");
    }

    if (!dadosChecklist.relato.trim()) {
      return mostrarToast("Por favor, preencha o Relato do Problema no checklist.", "erro");
    }

    try {
      setGerandoOs(true);

      await criarOrdemServico({
        cpfCliente: clienteSelecionado.cpf,
        imeiAparelho: imeiAparelhoValidado,
        idUsuario: idDoAtendente,
        diagnostico: dadosChecklist.relato,
        numOsAnterior: dadosChecklist.osAnterior ? Number(dadosChecklist.osAnterior) : undefined
      });

      mostrarToast("Ordem de Servico gerada com sucesso!", "sucesso");
      
      setClienteSelecionado({} as criarClienteDto); 
      setImeiAparelhoValidado(null);
      setDadosChecklist({
        tecnico: "",
        osAnterior: "",
        relato: "",
        itens: ITENS_CHECKLIST.map(nome => ({ nome, status: null, obs: "" }))
      });
      
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Erro ao processar a Ordem de Servico.";
      mostrarToast(Array.isArray(msg) ? msg[0] : msg, "erro");
    } finally {
      setGerandoOs(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
      <CustomerSearch 
        mostrarToast={mostrarToast} 
        clienteSelecionado={clienteSelecionado} 
        setClienteSelecionado={setClienteSelecionado} 
      />
      
      {clienteSelecionado?.cpf && (
        <DeviceForm 
          mostrarToast={mostrarToast} 
          clienteSelecionado={clienteSelecionado} 
          onAparelhoCriado={(imei) => setImeiAparelhoValidado(imei)} 
        />
      )}
      
      {Boolean(imeiAparelhoValidado) && (
        <ChecklistForm 
          imeiAparelho={imeiAparelhoValidado!} 
          dadosChecklist={dadosChecklist} 
          setDadosChecklist={setDadosChecklist} 
        />
      )}
      
      {Boolean(imeiAparelhoValidado) && (
        <button 
          type="button" 
          onClick={handleGerarOSFinal} 
          disabled={gerandoOs} 
          className="w-full mt-2 flex justify-center items-center gap-2 bg-[#F25C38] hover:bg-[#e04f2d] text-white px-10 py-4 rounded-2xl font-bold transition-colors disabled:opacity-50"
        >
          {gerandoOs ? <Loader2 className="animate-spin" size={20} /> : "Finalizar: Gerar Ordem de Servico"}
        </button>
      )}
    </div>
  );
}