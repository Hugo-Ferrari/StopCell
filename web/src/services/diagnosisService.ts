import api from "@/api/api";

export interface DiagnosticoDto {
    numOs: number;
    relatoTecnico: string;
}

// cada vez que salva vira um registro novo, assim fica o histórico do que o técnico foi achando
export async function salvarDiagnostico(dados: DiagnosticoDto) {
    const response = await api.post("/diagnostico", dados);
    return response.data;
}