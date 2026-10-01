import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import StoreCard from "@/components/settings/StoreCard";
import StoreForm from "@/components/settings/StoreForm";
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

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await buscarPerfilEmpresa();
        if (dados) {
          setStore(dados);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da empresa:", error);
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

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      <StoreCard store={store} />

      <StoreForm
        initialData={store}
        onSave={handleSalvar}
        loading={salvando}
      />
    </div>
  );
}

