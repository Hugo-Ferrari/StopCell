import api from "@/api/api";

// mesmos valores do enum FormaPagamento do prisma
export type FormaPagamento = "PIX" | "CARTAO" | "DINHEIRO" | "BOLETO";

export interface PagamentoOs {
    idPagamento: number;
    numOs: number;
    valorPago: string | number | null;
    formaPagamento: FormaPagamento | null;
    dtPagamento: string | null;
}

export async function listarPagamentosOs(numOs: number): Promise<PagamentoOs[]> {
    const response = await api.get(`/pagamento/os/${numOs}`);
    return response.data;
}

export async function registrarPagamento(numOs: number, valorPago: number, formaPagamento: FormaPagamento) {
    const response = await api.post("/pagamento", {
        numOs,
        pagamentos: [{ valorPago, formaPagamento }],
    });
    return response.data;
}