import api from "@/api/api";

export async function login(emailUsuario: string, senha: string) {
    const response = await api.post("/auth/login", {
        emailUsuario,
        senha
    });
    return response.data;
}
export async function cadastrarUsuario(dados: any) {
    const response = await api.post("/auth/register", dados);
    return response.data;
}

const TOKEN_KEY = "token";

export function salvarToken(token: string, lembrar: boolean) {
    if(lembrar){
        localStorage.setItem(TOKEN_KEY, token);
    }
    else{
        sessionStorage.setItem(TOKEN_KEY, token);
    }
}

export function obterToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    if(token){
        return token;
    }
    return sessionStorage.getItem(TOKEN_KEY);
}

export function removerToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
}

export async function esqueceuSenha(email: string) {
  const { data } = await api.post('/auth/esqueci-senha', { email });
  return data;
}

export async function redefinirSenha(payload: { email: string; codigo: string; novaSenha: string }) {
  const { data } = await api.post('/auth/redefinir-senha', payload);
  return data;
}