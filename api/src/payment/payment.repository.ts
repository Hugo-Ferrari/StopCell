import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PagamentoDto } from './dto/payment.dto';

@Injectable()
export class PagamentoRepository {
    constructor(private readonly prisma: PrismaService) {}

    registrar(dto: PagamentoDto & { cnpjEmpresa?: string }) {
        return this.prisma.pagamento.create({
            data: {
                ...dto,
                formaPagamento: dto.formaPagamento as 'PIX' | 'CARTAO',
            },
        });
    }
}