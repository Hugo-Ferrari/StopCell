import api from "@/api/api"

export interface PecaDto {
    valorPeca: number 
    descricao?: string
    quantidade?: number 
}

export async function criandoPeca(data:PecaDto) {
    const response = await api.post("/peca",data)
    
    return response.data
}

