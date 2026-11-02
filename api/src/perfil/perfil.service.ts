import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PerfilRepository } from './perfil.repository';
import { AtualizarPerfilDto, PerfilDto } from '@/type/perfil.dto';
import { CATALOGO_PERMISSOES, normalizarPermissoes } from '@/common/permissoes/catalogo';

@Injectable()
export class PerfilService {
  constructor(private readonly repository: PerfilRepository) {}

  catalogo() {
    return CATALOGO_PERMISSOES;
  }

  async listar(cnpjEmpresa: string) {
    const perfis = await this.repository.listar(cnpjEmpresa);

    // troca o _count do prisma por um campo mais fácil de usar no front
    return perfis.map(({ _count, ...perfil }) => ({
      ...perfil,
      totalUsuarios: _count.usuarios,
    }));
  }

  async criar(dto: PerfilDto, cnpjEmpresa: string) {
    try {
      return await this.repository.criar({
        cnpjEmpresa,
        nome: dto.nome.trim(),
        descricao: dto.descricao?.trim(),
        permissoes: normalizarPermissoes(dto.permissoes),
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Já existe um perfil com esse nome');
      }
      throw error;
    }
  }

  async atualizar(idPerfil: number, dto: AtualizarPerfilDto, cnpjEmpresa: string) {
    await this.garantirQueExiste(idPerfil, cnpjEmpresa);

    try {
      return await this.repository.atualizar(idPerfil, {
        nome: dto.nome?.trim(),
        descricao: dto.descricao?.trim(),
        permissoes: dto.permissoes ? normalizarPermissoes(dto.permissoes) : undefined,
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Já existe um perfil com esse nome');
      }
      throw error;
    }
  }

  async remover(idPerfil: number, cnpjEmpresa: string) {
    await this.garantirQueExiste(idPerfil, cnpjEmpresa);

    // não deixa apagar perfil em uso, senão o funcionário fica sem acesso nenhum
    const emUso = await this.repository.contarUsuarios(idPerfil);
    if (emUso > 0) {
      throw new BadRequestException(
        `Este perfil está em uso por ${emUso} usuário(s). Troque o perfil deles antes de excluir.`,
      );
    }

    await this.repository.remover(idPerfil);
    return { message: 'Perfil excluído' };
  }

  private async garantirQueExiste(idPerfil: number, cnpjEmpresa: string) {
    const perfil = await this.repository.buscarPorId(idPerfil, cnpjEmpresa);
    if (!perfil) throw new NotFoundException('Perfil não encontrado');
    return perfil;
  }
}