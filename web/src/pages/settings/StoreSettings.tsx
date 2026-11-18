import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import StoreCard from "@/components/settings/StoreCard";
import StoreForm from "@/components/settings/StoreForm";
import Alert from "@/components/common/Alert";
import { mensagemDeErro } from "@/utils/apiError";
import {
  buscarPerfilEmpresa,
  atualizarPerfilEmpresa,
  type EmpresaDTO,
  type UpdateEmpresaDTO,
} from "@/services/enterpriseService";

export default function StoreSettings() {
  const [store, setStore] = useState<EmpresaDTO>({
    cnpj: "",
    nomeFantasia: "",
    razaoSocial: "",
    telefone: "",
    endereco: "",
  });
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [sucesso, setSucesso] = useState("");
  const [erroCarregar, setErroCarregar] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await buscarPerfilEmpresa();
        if (dados) {
          setStore(dados);
        }
      } catch (error) {
        setErroCarregar(mensagemDeErro(error, "Não foi possível carregar os dados da loja. Recarregue a página."));
      } finally {
        setCarregandoInicial(false);
      }
    }

    carregarDados();
  }, []);

  async function handleSalvar(novosDados: UpdateEmpresaDTO) {
    setSalvando(true);
    try {
      const atualizado = await atualizarPerfilEmpresa(novosDados);
      setStore(atualizado || { ...store, ...novosDados });
      setEditando(false);
      setSucesso("Dados da loja atualizados com sucesso!");
    } finally {
      setSalvando(false);
    }
  }

  if (carregandoInicial) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (erroCarregar) {
    return <Alert mensagem={erroCarregar} />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      {editando ? (
        <StoreForm
          initialData={store}
          onSave={handleSalvar}
          loading={salvando}
          onCancelar={() => setEditando(false)}
        />
      ) : (
        <>
          <Alert mensagem={sucesso} tipo="sucesso" />
          <StoreCard
            store={store}
            onEditar={() => {
              setSucesso("");
              setEditando(true);
            }}
          />
        </>
      )}
    </div>
  );
}

