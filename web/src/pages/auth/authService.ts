import api from "@/api/api";

export interface CadastroLojaDTO {
    empresa: {
        nomeFantasia: string;
        razaoSocial: string;
        cnpj: string;
        telefone: string;
        endereco: string;
    };
    usuario: {
        nome: string;
        login: string;
        emailUsuario: string;
        senha: string;
    };
}

export async function login(emailUsuario: string, senha: string) {
    const response = await api.post<{ token: string }>("/auth/login", {
        emailUsuario,
        senha
    });
    return response.data;
}
export async function cadastrarUsuario(dados: CadastroLojaDTO) {
    const response = await api.post("/auth/register", dados);
    return response.data;
}

// as funções de token ficam em api/token.ts. reexporto aqui pra não quebrar quem já importa daqui
export { obterToken, removerToken, salvarToken, sairDoSistema } from "@/api/token";

export async function esqueceuSenha(email: string) {
  const { data } = await api.post('/auth/esqueci-senha', { email });
  return data;
}

export async function redefinirSenha(payload: { email: string; codigo: string; novaSenha: string }) {
  const { data } = await api.post('/auth/redefinir-senha', payload);
  return data;
}