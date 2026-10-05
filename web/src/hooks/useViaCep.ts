import { useState } from "react";

export interface EnderecoViaCep {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  enderecoFormatado: string;
}

export function useViaCep() {
  const [carregandoCep, setCarregandoCep] = useState(false);
  const [erroCep, setErroCep] = useState<string | null>(null);

  async function buscarCep(cep: string): Promise<EnderecoViaCep | null> {
    const rawCep = cep.replace(/\D/g, "").slice(0, 8);
    if (rawCep.length !== 8) {
      return null;
    }

    setCarregandoCep(true);
    setErroCep(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setErroCep("CEP não encontrado");
        return null;
      }

      const partes = [
        data.logradouro,
        data.bairro ? `Bairro ${data.bairro}` : "",
        data.localidade && data.uf ? `${data.localidade} - ${data.uf}` : data.localidade,
      ].filter(Boolean);

      const enderecoFormatado = partes.join(", ");

      return {
        cep: data.cep || rawCep,
        logradouro: data.logradouro || "",
        complemento: data.complemento || "",
        bairro: data.bairro || "",
        localidade: data.localidade || "",
        uf: data.uf || "",
        enderecoFormatado,
      };
    } catch {
      setErroCep("Erro ao buscar CEP");
      return null;
    } finally {
      setCarregandoCep(false);
    }
  }

  return {
    buscarCep,
    carregandoCep,
    erroCep,
  };
}
