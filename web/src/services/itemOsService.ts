import api from "@/api/api";
import type { TipoItemOs } from "@/types/ordemServico";

// sem estoque: cada item leva a própria descrição e o tipo (peça ou serviço)
export interface LancarItemOsDto {
    numOs: number;
    tipo: TipoItemOs;
    descricao: string;
    quantidade: number;
    valorUnitario: number;
}

export async function lancarItemOs(dados: LancarItemOsDto) {
    const response = await api.post("/item-os", dados);
    return response.data;
}

export async function removerItemOs(idItemOs: number) {
    const response = await api.delete(`/item-os/${idItemOs}`);
    return response.data;
}