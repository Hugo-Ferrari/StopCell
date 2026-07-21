import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PagamentoPixDto } from './dto/pagamentoPix.dto';
import { PagamentoPixRepository } from './pagamentoPix.repository';


@Injectable()
export class PagamentoPixService {
    constructor(private readonly repository: PagamentoPixRepository) {}

    registrar(dto: PagamentoPixDto, cnpjEmpresa: string) {
        const qrCode = this.gerarQrCode(dto);
        const txid = randomUUID().replace(/-/g, '').substring(0, 32);

        return this.repository.registrar({
            ...dto,
            cnpjEmpresa,
            qrCode,
            txid,
            formaPagamento: 'PIX',
            dtPagamento: new Date(),
        });
    }

    gerarQrCode(dto: PagamentoPixDto): string {
        const chavePix = dto.chavePix ?? '';
        const valor = dto.valorPago != null ? dto.valorPago.toFixed(2) : '0.00';

        return `00020126${chavePix.length}${chavePix}${valor}6304ABCD`;
    }

    async verificarTransacao(txid: string, cnpjEmpresa: string): Promise<boolean> {
        const pagamento = await this.repository.findByTxid(txid, cnpjEmpresa);
        return pagamento !== null;
    }
}