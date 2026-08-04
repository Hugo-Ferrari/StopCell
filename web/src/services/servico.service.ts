import api from "@/api/api";

export interface ServicoDto {

    descricao?: string;
    valorServico: number 
}

 export async function criarServico(data: ServicoDto) {
    const response = await api.post("/servico",data)
    return response.data
    
}