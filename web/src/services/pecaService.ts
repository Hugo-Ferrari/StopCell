import api from "@/api/api";
export interface PecaDTO {
    idPeca :number
    descricao: string 
    valor: number
    quantidade:number
}
export async function listarPeca() {
    const response = await api.get('/peca')
    return response
}


export async function criarPeca(data: PecaDTO) {
    const response = await api.post('/peca',data)
    return response.data
    
}