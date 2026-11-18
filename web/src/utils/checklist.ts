export const ITENS_CHECKLIST = [
  "Tela / Touch", "Botões", "Câmera frontal", "Câmera traseira",
  "Conector de carga", "Som / Alto-falante", "Microfone",
  "Wi-Fi / Rede", "Biometria / Face ID", "Bateria",
  "Avarias físicas", "Chip / SIM",
];

export type StatusItem = "OK" | "NOK" | "NA" | null;

export interface DadosChecklist {
  retrabalho: boolean;
  osAnterior: string;
  relato: string;
  itens: { nome: string; status: StatusItem; obs: string }[];
}

export function checklistVazio(): DadosChecklist {
  return {
    retrabalho: false,
    osAnterior: "",
    relato: "",
    itens: ITENS_CHECKLIST.map((nome) => ({ nome, status: null, obs: "" })),
  };
}
