import { Injectable } from '@nestjs/common';
import { categoriaRepository } from './category.repository';
import { categoriaDto } from './dto/category.dto';

@Injectable()
export class CategoriaService {
  constructor(private readonly repository: categoriaRepository) {}
  // adicionar ligação entre categoria e empresa no PRISMA
  async cadastrar(dto: categoriaDto, ) {
    return await this.repository.cadastro(dto, );
  }

  async atualizar(id: number, dto: categoriaDto, ) {
    const categoria = await this.repository.findByid(id, );

    if (categoria) {
      return this.repository.atualizar(id, dto, );
    }
    return null;
  }
}
