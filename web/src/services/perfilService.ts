import api from "@/api/api";

export interface PermissaoCatalogo {
  chave: string;
  grupo: string;
  nome: string;
  descricao: string;
}

export interface PerfilAcesso {
  idPerfil: number;
  nome: string;
  descricao: string | null;
  permissoes: string[];
  totalUsuarios: number;
}

export interface PerfilDTO {
  nome: string;
  descricao?: string;
  permissoes: string[];
}

export async function listarCatalogoPermissoes() {
  const { data } = await api.get<PermissaoCatalogo[]>("/perfis/permissoes");
  return data;
}

export async function listarPerfis() {
  const { data } = await api.get<PerfilAcesso[]>("/perfis");
  return data;
}

export async function criarPerfil(dados: PerfilDTO) {
  const { data } = await api.post<PerfilAcesso>("/perfis", dados);
  return data;
}

export async function atualizarPerfil(idPerfil: number, dados: PerfilDTO) {
  const { data } = await api.patch<PerfilAcesso>(`/perfis/${idPerfil}`, dados);
  return data;
}

export async function removerPerfil(idPerfil: number) {
  await api.delete(`/perfis/${idPerfil}`);
}