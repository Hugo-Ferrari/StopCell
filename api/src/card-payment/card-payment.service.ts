import { Injectable, Req } from '@nestjs/common';
import { PagamentoCartaoDto } from './dto/pagamentoCartao.dto';
import { PagamentoCartaoRepository } from './card-payment.repository';


@Injectable()
export class PagamentoCartaoService {
    constructor(private readonly repository: PagamentoCartaoRepository) {}

    registrar(dto: PagamentoCartaoDto, cnpjEmpresa: string, @Req() req: Request) {
        return this.repository.registrar({
            ...dto,
            cnpjEmpresa,
            formaPagamento: 'CARTAO',
            dtPagamento: new Date(),
        });
    }

    calcularValorParcela(dto: PagamentoCartaoDto): number {
        const { numParcelas, valorPago } = dto;

        if (numParcelas <= 0) {
            throw new Error('O número de parcelas deve ser maior que zero.');
        }
        if (!valorPago || valorPago <= 0) {
            throw new Error('O valor do pagamento deve ser maior que zero.');
        }

        return Math.round((valorPago / numParcelas) * 100) / 100;
    }

    async verificarTransacao(idPagamento: number, cnpjEmpresa: string): Promise<boolean> {
        const total = await this.repository.verificarTransacao(idPagamento, cnpjEmpresa);
        return total > 0;
    }
}