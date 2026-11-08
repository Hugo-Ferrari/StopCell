import api from "@/api/api"
import type { StatusOs } from "@/types/ordemServico"

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

// o que vem do GET /aparelho/cliente/:cpf
export interface AparelhoDoCliente {
    imei: string;
    modelo: string | null;
    cor: string | null;
    senhaAparelho: string | null;
    tipoSenha: string | null;
    idMarca: number;
    idCategoria: number;
    cpfCliente: string;
    marca: { idMarca: number; nmMarca: string | null };
    categoria: { idCategoria: number; nmCategoria: string | null };
    _count: { ordensServico: number };
    ordensServico: { numOs: number; dtEntrada: string | null; status: StatusOs }[];
}

export interface OpcoesAparelho {
    categorias: { idCategoria: number; nmCategoria: string | null }[];
    marcas: { idMarca: number; nmMarca: string | null }[];
}

export async function listarAparelho() {
    const response = await api.get("/aparelho")
    return response.data
}

export async function listarAparelhosDoCliente(cpf: string) {
    const response = await api.get<AparelhoDoCliente[]>(`/aparelho/cliente/${cpf}`)
    return response.data
}

export async function listarOpcoesAparelho() {
    const response = await api.get<OpcoesAparelho>("/aparelho/opcoes")
    return response.data
}

export async function criarAparelho(data: AparelhoDto) {
    const response = await api.post("/aparelho", data)
    return response.data
}

export async function atualizarAparelho(imei: string, data: AparelhoDto) {
    const response = await api.put(`/aparelho/${imei}`, data)
    return response.data
}