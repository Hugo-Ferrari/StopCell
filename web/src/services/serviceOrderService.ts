import api from "@/api/api";
import type { OrdemDetalheInterface, OrdemServicoResumo, StatusOs } from "@/types/ordemServico";

// o atendente não vai mais daqui: a API pega quem está logado pelo token
export interface OrdemServicoDTO {
    cpfCliente: string;
    imeiAparelho: string;
    diagnostico?: string;
    numOsAnterior?: number;
}

export async function criarOrdemServico(dados: OrdemServicoDTO) {
    const response = await api.post("/ordemServico", dados);
    return response.data;
}

export async function listarOs(): Promise<OrdemServicoResumo[]> {
    const response = await api.get<OrdemServicoResumo[]>("/ordemServico");
    return response.data;
}

export async function buscarOrdemServicoPorNumero(numOs: number) {
    const response = await api.get<OrdemDetalheInterface>(`/ordemServico/${numOs}`);
    return response.data;
}

export async function atualizarStatusOs(numOs: number, status: StatusOs) {
    const response = await api.patch(`/ordemServico/${numOs}/status`, { status });
    return response.data;
}

export async function baixarPdfOs(numOs: number) {
    const response = await api.get<Blob>(`/ordemServico/${numOs}/pdf`, {
        responseType: "blob",
    });
    return response.data;
}

export async function buscarUltimaOsPorImei(imei: string) {
    try {
        const response = await api.get(`/ordemServico/aparelho/${imei}/ultima`);
        return response.data;
    } catch {
        return null;
    }
}