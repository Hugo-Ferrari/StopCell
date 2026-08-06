import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PagamentoCartaoRepository {
    constructor(private readonly prisma: PrismaService) {}

    registrar(data: any) {
        return this.prisma.pagamento.create({ data });
    }

    verificarTransacao(idPagamento: number, cnpjEmpresa?: string) {
        return this.prisma.pagamento.count({
            where: { idPagamento, formaPagamento: 'CARTAO', ...(cnpjEmpresa ? { ordemServico: { cnpjEmpresa } } : {}) },
        });
    }
}