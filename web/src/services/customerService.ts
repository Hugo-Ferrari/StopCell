import api from "@/api/api"
import type { AparelhoDto } from "./deviceService"


export interface criarClienteDto {
    cpf: string,
    email: string
    nmCompleto: string,
    telefone: string,
    endereco: string

    aparelhos: AparelhoDto[]
}



export async function criandoCliente(data: criarClienteDto) {
    const response = await api.post("/clientes",data)
    return response.data
    
}

export async function buscarClientePorCpf(cpf:string){
    const response = await api.get(`/clientes/${cpf}`)
    return response.data
}