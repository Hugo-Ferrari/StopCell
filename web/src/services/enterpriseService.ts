import api from "@/api/api";

export interface EmpresaDTO {
  cnpj: string;
  nomeFantasia: string;
  razaoSocial: string;
  telefone: string;
  endereco: string;
}

export function obterCnpjDoToken(): string | null {
  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return null;

    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const parsed = JSON.parse(jsonPayload);
    return parsed?.cnpjEmpresa ?? null;
  } catch {
    return null;
  }
}

export async function buscarEmpresa(cnpj: string) {
  const response = await api.get(`/empresa/${cnpj}`);
  return response.data;
}

export async function atualizarEmpresa(cnpj: string, data: EmpresaDTO) {
  const response = await api.patch(`/empresa/${cnpj}`, data);
  return response.data;
}
