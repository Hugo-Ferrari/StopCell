import { api } from "../api/api";

export async function login(emailUsuario:string, senha:string) {
    const response = await api.post("/auth/login",{
        emailUsuario,
        senha
    })
    return response.data
}

const TOKEN_KEY = "token";

export function salvarToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function obterToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function removerToken() {
    localStorage.removeItem(TOKEN_KEY);
}