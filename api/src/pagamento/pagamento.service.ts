import { Injectable } from '@nestjs/common';
import { PagamentoRepository } from './pagamento.repository';
import { PagamentoDto } from './dto/pagamento.dto';

@Injectable()
export class PagamentoService {
    constructor(private readonly repository: PagamentoRepository) {}

    registrar(dto: PagamentoDto, cnpjEmpresa: string) {
        return this.repository.registrar({ ...dto, cnpjEmpresa });
    }
}