// tipos da O.S. num lugar só. antes tinha cópia em History.tsx e em pages/orders/models,
// e cada uma estava de um jeito

// mesmos valores do enum StatusOs do prisma
export type StatusOs =
    | "ABERTA"
    | "DIAGNOSTICO"
    | "EM_APROVACAO"
    | "EM_REPARO"
    | "AGUARDANDO_PECA"
    | "FINALIZADO"
    | "CANCELADO";

export type TipoItemOs = "PECA" | "SERVICO";

// o que vem do GET /ordemServico (lista e histórico)
export interface OrdemServicoResumo {
    numOs: number;
    numOsAnterior: number | null;
    cpfCliente: string;
    imeiAparelho: string;
    dtEntrada: string | null;
    status: StatusOs;
    vlTotal?: string | null;
    cliente: { nmCompleto: string };
    aparelho: { modelo: string };
}

export interface DiagnosticoInterface {
    idDiagnostico: number;
    relatoTecnico?: string;
    dataHora?: string;
}

// o prisma devolve Decimal como string, por isso valorUnitario vem como string
export interface ItemOsInterface {
    idItemOs: number;
    tipo: TipoItemOs;
    descricao: string;
    quantidade?: number;
    valorUnitario?: string;
}

// cada aviso de status mandado pro cliente (tabela log_notificacao)
export type ResultadoAviso = "ENVIADO" | "FALHOU" | "SEM_EMAIL" | "NAO_CONFIGURADO";

export interface AvisoClienteInterface {
    idLogNotificacao: number;
    tipoEvento: StatusOs | null;
    dtHoraEnvio: string | null;
    statusEnvio: ResultadoAviso | null;
}

// o que vem do GET /ordemServico/:numOs
export interface OrdemDetalheInterface {
    numOs: number;
    numOsAnterior?: number | null;
    status: StatusOs;
    diagnostico?: string;
    dtEntrada?: string;
    dtSaida?: string;
    vlTotal?: string;
    cliente?: {
        nmCompleto?: string;
        telefone?: string;
        email?: string;
    };
    aparelho?: {
        modelo?: string;
        cor?: string;
        imei?: string;
    };
    usuario?: {
        nome?: string;
    };
    diagnosticos?: DiagnosticoInterface[];
    itensOs?: ItemOsInterface[];
    logNotificacoes?: AvisoClienteInterface[];
}