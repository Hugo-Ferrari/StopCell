import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { criarClienteDto } from "@/services/customerService";
import { criarOrdemServico } from "@/services/serviceOrderService";
import { salvarChecklistOs } from "@/services/osChecklistService";
import { mensagemDeErro } from "@/utils/apiError";
import CustomerSearch from "./CustomerSearch";
import AparelhosDoCliente from "./aparelho/AparelhosDoCliente";
import ChecklistForm, { ITENS_CHECKLIST } from "./ChecklistForm";

interface ExistingCustomerProps {
  mostrarToast: (msg: string, tipo: "sucesso" | "erro") => void;
  clienteSelecionado: criarClienteDto;
  setClienteSelecionado: (cliente: criarClienteDto) => void;
}

export default function ExistingCustomer({ mostrarToast, clienteSelecionado, setClienteSelecionado }: ExistingCustomerProps) {
  const [imeiAparelhoValidado, setImeiAparelhoValidado] = useState<string | null>(null);
  const [gerandoOs, setGerandoOs] = useState(false);

  const [dadosChecklist, setDadosChecklist] = useState({
    tecnico: "",
    osAnterior: "",
    relato: "",
    itens: ITENS_CHECKLIST.map(nome => ({ nome, status: null as "OK" | "NOK" | "NA" | null, obs: "" }))
  });

  async function handleGerarOSFinal() {
    if (!clienteSelecionado?.cpf || !imeiAparelhoValidado) return;

    if (!dadosChecklist.relato.trim()) {
      return mostrarToast("Por favor, preencha o Relato do Problema no checklist.", "erro");
    }

    try {
      setGerandoOs(true);

      const novaOs = await criarOrdemServico({
        cpfCliente: clienteSelecionado.cpf,
        imeiAparelho: imeiAparelhoValidado,
        diagnostico: dadosChecklist.relato,
        numOsAnterior: dadosChecklist.osAnterior ? Number(dadosChecklist.osAnterior) : undefined
      });

      // antes o checklist marcado aqui se perdia, agora vai junto com a O.S.
      // se falhar não desfaz nada: a O.S. já existe e dá pra preencher pela tela dela
      let checklistSalvo = true;
      try {
        await salvarChecklistOs(
          novaOs.numOs,
          dadosChecklist.itens.map((item) => ({ descricao: item.nome, status: item.status, observacao: item.obs }))
        );
      } catch {
        checklistSalvo = false;
      }

      if (checklistSalvo) {
        mostrarToast(`O.S. #${novaOs.numOs} gerada com sucesso!`, "sucesso");
      } else {
        mostrarToast(`O.S. #${novaOs.numOs} criada, mas o checklist não foi salvo. Preencha pela tela da O.S.`, "erro");
      }

      setClienteSelecionado({} as criarClienteDto);
      setImeiAparelhoValidado(null);
      setDadosChecklist({
        tecnico: "",
        osAnterior: "",
        relato: "",
        itens: ITENS_CHECKLIST.map(nome => ({ nome, status: null, obs: "" }))
      });

    } catch (error) {
      mostrarToast(mensagemDeErro(error, "Erro ao processar a Ordem de Serviço."), "erro");
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
        <AparelhosDoCliente
          // key: trocou de cliente, a lista e o formulário começam do zero
          key={clienteSelecionado.cpf}
          cpfCliente={clienteSelecionado.cpf}
          mostrarToast={mostrarToast}
          onAparelhoDefinido={setImeiAparelhoValidado}
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
          className="w-full mt-2 flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-2xl font-bold transition-colors disabled:opacity-50"
        >
          {gerandoOs ? <Loader2 className="animate-spin" size={20} /> : "Finalizar: Gerar Ordem de Servico"}
        </button>
      )}
    </div>
  );
}