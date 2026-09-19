import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import StoreCard from "@/components/settings/StoreCard";
import StoreForm from "@/components/settings/StoreForm";
import {
  buscarEmpresa,
  atualizarEmpresa,
  obterCnpjDoToken,
  type EmpresaDTO,
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
      const cnpj = obterCnpjDoToken();
      if (!cnpj) {
        // Fallback local se não encontrar token decodificado
        const local = localStorage.getItem("stopcell_empresa");
        if (local) {
          try {
            setStore(JSON.parse(local));
          } catch {
            // ignora erro de parse
          }
        }
        setCarregandoInicial(false);
        return;
      }

      try {
        const dados = await buscarEmpresa(cnpj);
        if (dados) {
          setStore({
            cnpj: dados.cnpj || cnpj,
            nomeFantasia: dados.nomeFantasia || "",
            razaoSocial: dados.razaoSocial || "",
            telefone: dados.telefone || "",
            endereco: dados.endereco || "",
          });
        }
      } catch {
        // Fallback se a API falhar ou estiver offline
        const local = localStorage.getItem("stopcell_empresa");
        if (local) {
          try {
            setStore(JSON.parse(local));
          } catch {
            // ignora erro
          }
        }
      } finally {
        setCarregandoInicial(false);
      }
    }

    carregarDados();
  }, []);

  async function handleSalvar(novosDados: EmpresaDTO) {
    setSalvando(true);
    try {
      localStorage.setItem("stopcell_empresa", JSON.stringify(novosDados));

      if (novosDados.cnpj) {
        await atualizarEmpresa(novosDados.cnpj, novosDados);
      }
      setStore(novosDados);
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
