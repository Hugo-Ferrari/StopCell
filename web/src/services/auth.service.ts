import { api } from "../api/api";

export async function login(emailUsuario:string, senha:string) {
    const response = await api.post("/auth/login",{
        emailUsuario,
        senha
    })
    return response.data
}

const TOKEN_KEY = "token";

export function salvarToken(token: string, lembrar: boolean) {
    if(lembrar){

        localStorage.setItem(TOKEN_KEY, token);
    }
    else{
        sessionStorage.setItem(TOKEN_KEY,token)
    }
}

export function obterToken() {
    const token = localStorage.getItem(TOKEN_KEY)
    if(token){
        return token
    }
    return sessionStorage.getItem(TOKEN_KEY)
}

export function removerToken() {
         localStorage.removeItem(TOKEN_KEY)
         sessionStorage.removeItem(TOKEN_KEY)
}