import { Injectable } from '@nestjs/common';
import { PecaRepository } from './peca.reposiotory';
import { PecaDto } from './dto/peca.dto';

@Injectable()
export class PecaService {
    constructor(private readonly repository: PecaRepository) {}

    async cadastrar(dto: PecaDto, cnpjEmpresa: string) {
        return await this.repository.cadastro({ ...dto, cnpjEmpresa });
    }

    async atualizar(id: number, dto: PecaDto, cnpjEmpresa: string) {
        const peca = await this.repository.findByIdPeca(id, cnpjEmpresa);
        if (!peca) return null;
        return this.repository.atualizar(id, dto, cnpjEmpresa);
    }

    async verificarEstoque(cnpjEmpresa: string) {
        return await this.repository.findAll(cnpjEmpresa);
    }
}
