
import { Injectable } from '@nestjs/common';
import { AparelhoRepository } from './aparelho.repository';
import { AparelhoDto } from './dto/aparelho.dto';

@Injectable()
export class AparelhoService {
    constructor(private readonly repository: AparelhoRepository) { }

    async cadastro(dto: AparelhoDto, cnpjEmpresa: string) {
        return await this.repository.cadastro({ ...dto, cnpjEmpresa });
    }
    async listar(cnpjEmpresa:string){
        return await this.repository.listar(cnpjEmpresa)
    }

    async atualizar(id: string, dto: AparelhoDto, cnpjEmpresa: string) {
        const total = await this.repository.findById(id, cnpjEmpresa);

        if (total > 0) return this.repository.atualizar(id, dto, cnpjEmpresa);

        return null;
    }
}
