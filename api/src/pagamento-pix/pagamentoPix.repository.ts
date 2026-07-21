import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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