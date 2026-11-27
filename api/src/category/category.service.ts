import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { categoriaRepository } from './category.repository';
import { categoriaDto } from '@/type/category.dto';

@Injectable()
export class CategoriaService {
  constructor(private readonly repository: categoriaRepository) {}

  private exigirEmpresa(cnpjEmpresa: string) {
    if (!cnpjEmpresa) throw new BadRequestException('Empresa não identificada');
  }

  // se já existe uma categoria com esse nome (padrão ou da loja), devolve ela em vez de duplicar
  async cadastrar(dto: categoriaDto, cnpjEmpresa: string) {
    this.exigirEmpresa(cnpjEmpresa);
    const nome = dto.nmCategoria.trim();

    const existente = await this.repository.findVisivelPorNome(nome, cnpjEmpresa);
    if (existente) return existente;

    return this.repository.cadastro(nome, cnpjEmpresa);
  }

  async atualizar(id: number, dto: categoriaDto, cnpjEmpresa: string) {
    this.exigirEmpresa(cnpjEmpresa);

    const categoria = await this.repository.findByid(id);

    // categoria de outra loja responde como se não existisse
    if (!categoria || (categoria.cnpjEmpresa !== null && categoria.cnpjEmpresa !== cnpjEmpresa)) {
      throw new NotFoundException('Categoria não encontrada');
    }

    if (categoria.cnpjEmpresa === null) {
      throw new ForbiddenException(
        'Essa categoria é padrão do sistema e não pode ser alterada. Cadastre uma nova se precisar.',
      );
    }

    const nome = dto.nmCategoria.trim();
    const mesmoNome = await this.repository.findVisivelPorNome(nome, cnpjEmpresa);
    if (mesmoNome && mesmoNome.idCategoria !== id) {
      throw new ConflictException('Já existe uma categoria com esse nome.');
    }

    return this.repository.atualizar(id, nome);
  }
}