import api from "@/api/api";

export interface Servico {

    descricao?: string;
    valorServico: number 
}

 export async function criarServico(data: Servico) {
    const response = await api.post("/servico",data)
    return response.data
    
}