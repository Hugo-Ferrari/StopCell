import { Injectable } from '@nestjs/common';
import { categoriaRepository } from './categoria.repository';
import { categoriaDto } from './dto/categoria.dto';

@Injectable()
export class CategoriaService {
    constructor(private readonly repository: categoriaRepository){}

    async cadastrar(dto: categoriaDto, cnpjEmpresa: string) {
        return await this.repository.cadastro({ ...dto, cnpjEmpresa });
    }

    async atualizar(id: number, dto: categoriaDto, cnpjEmpresa: string) {
        const total = await this.repository.findByid(id, cnpjEmpresa);

        if (total > 0) {
            return this.repository.atualizar(id, dto, cnpjEmpresa);
        }
        return null;
    }
}
