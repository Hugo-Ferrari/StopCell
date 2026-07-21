import { Injectable } from '@nestjs/common';
import { MarcaRepository } from './marca.repository';
import { MarcaDto } from './dto/marca.dto';

@Injectable()
export class MarcaService {
    constructor(private readonly repository: MarcaRepository) {}

    async cadastrar(dto: MarcaDto, cnpjEmpresa: string) {
        return await this.repository.cadastro({ ...dto, cnpjEmpresa });
    }

    async atualizar(id: number, dto: MarcaDto, cnpjEmpresa: string) {
        const marca = await this.repository.findByid(id, cnpjEmpresa);
        if (marca) return this.repository.atualizar(id, dto, cnpjEmpresa);

        return null;
    }

    async listarPorNomes(nome: string, cnpjEmpresa: string) {
        return await this.repository.findByMarcaNome(nome, cnpjEmpresa);
    }
}
