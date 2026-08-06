import { Injectable } from '@nestjs/common';
import { ServicoRepository } from './service.repository';
import { ServicoDto } from './dto/service.dto';

@Injectable()
export class ServicoService {
    constructor(private readonly repository: ServicoRepository) { }

    async cadastrar(dto: ServicoDto, cnpjEmpresa: string) {
        return await this.repository.create({ ...dto, cnpjEmpresa });
    }

    async atualizar(id: number, dto: ServicoDto, cnpjEmpresa: string) {
        const servico = await this.repository.findByIdServico(id, cnpjEmpresa);

        if (servico) return this.repository.atualizar(id, dto, cnpjEmpresa);

        return null;
    }
}