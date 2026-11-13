import api from "@/api/api";

export interface PerfilResumo {
  idPerfil: number;
  nome: string;
}

export interface UsuarioLogado {
  idUsuario: number;
  nome: string | null;
  login: string | null;
  emailUsuario: string | null;
  nivelAcesso: string | null;
  ativo: boolean;
  ehDono: boolean;
  perfil: PerfilResumo | null;
  permissoes: string[];
}

export type UsuarioDaLoja = Omit<UsuarioLogado, "permissoes">;

export interface NovoUsuarioDTO {
  nome: string;
  login: string;
  emailUsuario: string;
  senha: string;
  idPerfil: number;
}

// na edição tudo é opcional, e a senha só vai se o dono digitar uma nova
export type AtualizarUsuarioDTO = Partial<NovoUsuarioDTO> & { ativo?: boolean };

export async function buscarUsuarioLogado() {
  const { data } = await api.get<UsuarioLogado>("/usuario/me");
  return data;
}

export type AtualizarMeuPerfilDTO = Pick<NovoUsuarioDTO, "nome" | "login" | "emailUsuario">;

export async function listarUsuarios() {
  const { data } = await api.get<UsuarioDaLoja[]>("/usuario");
  return data;
}

export async function criarUsuario(dados: NovoUsuarioDTO) {
  const { data } = await api.post<UsuarioDaLoja>("/usuario", dados);
  return data;
}

export async function atualizarUsuario(idUsuario: number, dados: AtualizarUsuarioDTO) {
  const { data } = await api.patch<UsuarioDaLoja>(`/usuario/${idUsuario}`, dados);
  return data;
}