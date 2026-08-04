
import api from "@/api/api"

export interface AparelhoDto {
    id: number;
    modelo: string;
    cor: string;
    imei: string;
}

export async function listarAparelho(){
    const response = await api.get("/aparelho")
    return response.data

}

export async function BuscarAparelho(imei:string) {
    const response = await api.get(`/aparelho/${imei}`)
    return response.data
    
}