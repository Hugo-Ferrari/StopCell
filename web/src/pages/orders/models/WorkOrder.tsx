export interface OrdemServicoInterface {
  numOs: number;
  cpfCliente: string;
  imeiAparelho: string;
  dtEntrada: string;
  status: "ABERTA" | "DIAGNOSTICO" | "EM_REPARO" | "FINALIZADO";

  cliente: {
    nmCompleto: string;
  };

  aparelho: {
    modelo: string;
  };
}