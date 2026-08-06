
import api from "@/api/api"

export interface AparelhoDto {
    modelo: string;
    cor: string;
    imei: string;
    marca: {
        idMarca: number;
        nmMarca: string;
    }

    categoria: {
        idCategoria: number;
        nmCategoria: string;
    }
    senhaAparelho: string;
    tipoSenha: string;
}


export async function listarAparelho() {
    const response = await api.get("/aparelho")
    return response.data

}

export async function BuscarAparelho(imei: string) {
    const response = await api.get(`/aparelho/${imei}`)
    return response.data

}