import { Injectable } from '@nestjs/common';
import { MarcaRepository } from './mark.repository';
import { MarcaDto } from './dto/mark.dto';

@Injectable()
export class MarcaService {
    constructor(private readonly repository: MarcaRepository) {}

    async cadastrar(dto: MarcaDto) {
        return await this.repository.cadastro({ ...dto });
    }

    async atualizar(id: number, dto: MarcaDto) {
        const marca = await this.repository.findByid(id);
        if (marca) return this.repository.atualizar(id, dto);

        return null;
    }

    async listarPorNomes(nome: string) {
        return await this.repository.findByMarcaNome(nome);
    }
}