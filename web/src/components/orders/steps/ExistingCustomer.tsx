import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { criarClienteDto } from "@/services/customerService";
import { criarOrdemServico } from "@/services/serviceOrderService";
import { salvarChecklistOs } from "@/services/osChecklistService";
import { mensagemDeErro } from "@/utils/apiError";
import CustomerSearch from "./CustomerSearch";
import AparelhosDoCliente from "./aparelho/AparelhosDoCliente";
import ChecklistForm, { checklistVazio, type DadosChecklist } from "./ChecklistForm";

interface ExistingCustomerProps {
  mostrarToast: (msg: string, tipo: "sucesso" | "erro") => void;
  clienteSelecionado: criarClienteDto;
  setClienteSelecionado: (cliente: criarClienteDto) => void;
}

export default function ExistingCustomer({ mostrarToast, clienteSelecionado, setClienteSelecionado }: ExistingCustomerProps) {
  const [imeiAparelhoValidado, setImeiAparelhoValidado] = useState<string | null>(null);
  const [gerandoOs, setGerandoOs] = useState(false);
  const [dadosChecklist, setDadosChecklist] = useState<DadosChecklist>(checklistVazio);

  async function handleGerarOs() {
    if (!clienteSelecionado?.cpf || !imeiAparelhoValidado) return;

    if (!dadosChecklist.relato.trim()) {
      return mostrarToast("Preencha o relato do problema.", "erro");
    }

    if (dadosChecklist.retrabalho && !dadosChecklist.osAnterior) {
      return mostrarToast("Informe o número da O.S. anterior ou marque que não é retrabalho.", "erro");
    }

    try {
      setGerandoOs(true);

      const novaOs = await criarOrdemServico({
        cpfCliente: clienteSelecionado.cpf,
        imeiAparelho: imeiAparelhoValidado,
        diagnostico: dadosChecklist.relato.trim(),
        // só vai quando a pessoa marcou que é retrabalho
        numOsAnterior: dadosChecklist.retrabalho ? Number(dadosChecklist.osAnterior) : undefined,
      });

      // o checklist vai junto com a O.S.
      // se falhar não desfaz nada: a O.S. já existe e dá pra preencher pela tela dela
      let checklistSalvo = true;
      try {
        await salvarChecklistOs(
          novaOs.numOs,
          dadosChecklist.itens.map((item) => ({ descricao: item.nome, status: item.status, observacao: item.obs })),
        );
      } catch {
        checklistSalvo = false;
      }

      if (checklistSalvo) {
        mostrarToast(`O.S. #${novaOs.numOs} gerada.`, "sucesso");
      } else {
        mostrarToast(`O.S. #${novaOs.numOs} criada, mas o checklist não foi salvo. Preencha pela tela da O.S.`, "erro");
      }

      setClienteSelecionado({} as criarClienteDto);
      setImeiAparelhoValidado(null);
      setDadosChecklist(checklistVazio());
    } catch (error) {
      mostrarToast(mensagemDeErro(error, "Não foi possível gerar a ordem de serviço."), "erro");
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
          onAparelhoDefinido={(imei) => {
            setImeiAparelhoValidado(imei);
            // trocou de aparelho: o retrabalho marcado era do outro
            setDadosChecklist((atual) => ({ ...atual, retrabalho: false, osAnterior: "" }));
          }}
        />
      )}

      {imeiAparelhoValidado && (
        <ChecklistForm
          // key: trocou de aparelho, a pergunta do retrabalho começa do zero
          key={imeiAparelhoValidado}
          imeiAparelho={imeiAparelhoValidado}
          dadosChecklist={dadosChecklist}
          setDadosChecklist={setDadosChecklist}
        />
      )}

      {imeiAparelhoValidado && (
        <button
          type="button"
          onClick={handleGerarOs}
          disabled={gerandoOs}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-10 py-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {gerandoOs ? <Loader2 className="animate-spin" size={20} /> : "Gerar ordem de serviço"}
        </button>
      )}
    </div>
  );
}