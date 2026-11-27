import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MarcaRepository } from './mark.repository';
import { MarcaDto } from '@/type/mark.dto';

@Injectable()
export class MarcaService {
  constructor(private readonly repository: MarcaRepository) {}

  private exigirEmpresa(cnpjEmpresa: string) {
    if (!cnpjEmpresa) throw new BadRequestException('Empresa não identificada');
  }

  // se já existe uma marca com esse nome (padrão ou da loja), devolve ela em vez de duplicar
  async cadastrar(dto: MarcaDto, cnpjEmpresa: string) {
    this.exigirEmpresa(cnpjEmpresa);
    const nome = dto.nmMarca.trim();

    const existente = await this.repository.findVisivelPorNome(nome, cnpjEmpresa);
    if (existente) return existente;

    return this.repository.cadastro(nome, cnpjEmpresa);
  }

  async atualizar(id: number, dto: MarcaDto, cnpjEmpresa: string) {
    this.exigirEmpresa(cnpjEmpresa);

    const marca = await this.repository.findByid(id);

    // marca de outra loja responde como se não existisse
    if (!marca || (marca.cnpjEmpresa !== null && marca.cnpjEmpresa !== cnpjEmpresa)) {
      throw new NotFoundException('Marca não encontrada');
    }

    // a lista padrão é de todas as lojas: se uma mudar, muda pra todo mundo
    if (marca.cnpjEmpresa === null) {
      throw new ForbiddenException(
        'Essa marca é padrão do sistema e não pode ser alterada. Cadastre uma nova se precisar.',
      );
    }

    const nome = dto.nmMarca.trim();
    const mesmoNome = await this.repository.findVisivelPorNome(nome, cnpjEmpresa);
    if (mesmoNome && mesmoNome.idMarca !== id) {
      throw new ConflictException('Já existe uma marca com esse nome.');
    }

    return this.repository.atualizar(id, nome);
  }

  listarPorNomes(nome: string, cnpjEmpresa: string) {
    this.exigirEmpresa(cnpjEmpresa);
    return this.repository.buscarPorNome(nome.trim(), cnpjEmpresa);
  }
}