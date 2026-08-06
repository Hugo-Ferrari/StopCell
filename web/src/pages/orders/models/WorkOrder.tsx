export interface OrdemServicoInterface {
  numOs: number;
  dtEntrada: string;
  status: "ABERTA" | "DIAGNOSTICO" | "EM_REPARO" | "FINALIZADO";

  cliente: {
    nmCompleto: string;
  };

  aparelho: {
    modelo: string;
  };
}