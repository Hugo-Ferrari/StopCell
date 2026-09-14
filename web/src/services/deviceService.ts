import api from "@/api/api"

export interface AparelhoDto {
    imei: string;
    cor: string;
    modelo: string;
    senhaAparelho: string;
    tipoSenha: string;
    idMarca: number;
    idCategoria: number;
    cpfCliente: string; 
}

export async function listarAparelho() {
    const response = await api.get("/aparelho")
    return response.data
}

export async function BuscarAparelho(imei: string) {
    const response = await api.get(`/aparelho/${imei}`)
    return response.data
}

export async function criarAparelho(data: AparelhoDto) {
    const response = await api.post("/aparelho", data)
    return response.data
}