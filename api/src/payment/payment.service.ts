import { Injectable } from '@nestjs/common';
import { PagamentoRepository } from './payment.repository';
import { PagamentoDto } from './dto/payment.dto';

@Injectable()
export class PagamentoService {
    constructor(private readonly repository: PagamentoRepository) {}

    registrar(dto: PagamentoDto, cnpjEmpresa: string) {
        return this.repository.registrar({ ...dto, cnpjEmpresa });
    }
}