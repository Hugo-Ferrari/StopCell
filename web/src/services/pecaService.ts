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