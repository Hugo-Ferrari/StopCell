import api from "@/api/api";

export interface OrdemServicoDTO {
    cpfCliente: string;
    imeiAparelho: string;
    idUsuario: number;
    diagnostico?: string;
}


export async function criarOrdemServico(dados: OrdemServicoDTO) {
    const response = await api.post("/ordemServico",dados);

    return response.data;
}

export async function listarOs() {
    const response = await api.get("/ordemServico")
    return response.data
    
}

export async function buscarOrdemServicoPorNumero(numOs: number) {
    const response = await api.get(`/ordemServico/${numOs}`);
    return response.data;
}