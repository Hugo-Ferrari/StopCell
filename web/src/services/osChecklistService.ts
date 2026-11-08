import api from "@/api/api";

export type StatusChecklist = "OK" | "NOK" | "NA";

export interface ItemChecklistOs {
    descricao: string;
    status: StatusChecklist | null;
    observacao: string;
}

interface ItemChecklistApi {
    idChecklist: number;
    status: StatusChecklist | null;
    observacao: string | null;
    checklist: { descricao: string | null };
}

export async function buscarChecklistOs(numOs: number): Promise<ItemChecklistOs[]> {
    const response = await api.get<ItemChecklistApi[]>(`/os-checklist/${numOs}`);

    return response.data.map((item) => ({
        descricao: item.checklist.descricao ?? "",
        status: item.status,
        observacao: item.observacao ?? "",
    }));
}

// só manda o que foi marcado, item sem status não tem o que registrar
export async function salvarChecklistOs(numOs: number, itens: ItemChecklistOs[]) {
    const marcados = itens
        .filter((item) => item.status !== null)
        .map((item) => ({
            descricao: item.descricao,
            status: item.status,
            observacao: item.observacao.trim() || undefined,
        }));

    const response = await api.put(`/os-checklist/${numOs}`, { itens: marcados });
    return response.data;
}