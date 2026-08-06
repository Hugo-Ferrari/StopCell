export interface OrdemDetalheInterface {
    numOs: number;
    status: string;
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
    diagnosticos?: Array<{
        relatoTecnico?: string;
    }>;
    itensOs?: Array<{
        quantidade?: number;
        valorUnitario?: string;
        servico?: {
            descricao?: string;
        };
        peca?: {
            descricao?: string;
        };
    }>;
}
