import api from "@/api/api";

export interface EmpresaDTO {
  cnpj?: string;
  nomeFantasia: string;
  razaoSocial: string;
  telefone: string;
  endereco: string;
}

export type UpdateEmpresaDTO = Omit<EmpresaDTO, "cnpj">;

export async function buscarPerfilEmpresa(): Promise<EmpresaDTO> {
  const response = await api.get<EmpresaDTO>("/empresa/perfil");
  return response.data;
}

export async function atualizarPerfilEmpresa(data: UpdateEmpresaDTO): Promise<EmpresaDTO> {
  const response = await api.patch<EmpresaDTO>("/empresa/perfil", data);
  return response.data;
}
