import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PagamentoPixRepository {
    constructor(private readonly prisma: PrismaService) {}

    registrar(data: any) {
        return this.prisma.pagamento.create({ data });
    }

    findByTxid(txid: string, cnpjEmpresa?: string) {
        return this.prisma.pagamento.findFirst({
            where: { txid, formaPagamento: 'PIX', ...(cnpjEmpresa ? { ordemServico: { cnpjEmpresa } } : {}) },
        });
    }
}