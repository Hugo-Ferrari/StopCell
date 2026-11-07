import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuarioRepository } from './user.repository';
import { PerfilRepository } from '@/perfil/perfil.repository';
import { AtualizarFuncionarioDto, FuncionarioDto } from '@/type/funcionario.dto';
import { NIVEL_DONO, NIVEL_FUNCIONARIO, TODAS_PERMISSOES } from '@/common/permissoes/catalogo';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly repository: UsuarioRepository,
    private readonly perfilRepository: PerfilRepository,
  ) {}

  // dados do usuário logado + o que ele pode fazer (o front usa pra montar o menu)
  async me(idUsuario: number) {
    const usuario = await this.repository.buscarPorId(idUsuario);
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const ehDono = usuario.nivelAcesso === NIVEL_DONO;
    const { perfil, ...dados } = usuario;

    return {
      ...dados,
      ehDono,
      perfil: perfil ? { idPerfil: perfil.idPerfil, nome: perfil.nome } : null,
      permissoes: ehDono ? TODAS_PERMISSOES : (perfil?.permissoes ?? []),
    };
  }

  async listar(cnpjEmpresa: string) {
    const usuarios = await this.repository.listarDaEmpresa(cnpjEmpresa);
    return usuarios.map(({ perfil, ...u }) => ({
      ...u,
      ehDono: u.nivelAcesso === NIVEL_DONO,
      perfil: perfil ? { idPerfil: perfil.idPerfil, nome: perfil.nome } : null,
    }));
  }

  async criar(dto: FuncionarioDto, cnpjEmpresa: string) {
    await this.validarPerfil(dto.idPerfil, cnpjEmpresa);

    try {
      return await this.repository.criar({
        cnpjEmpresa,
        nome: dto.nome.trim(),
        login: dto.login.trim(),
        emailUsuario: dto.emailUsuario.trim().toLowerCase(),
        senha: await bcrypt.hash(dto.senha, 10),
        nivelAcesso: NIVEL_FUNCIONARIO,
        idPerfil: dto.idPerfil,
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Já existe um usuário com esse e-mail');
      }
      throw error;
    }
  }

  async atualizar(idUsuario: number, dto: AtualizarFuncionarioDto, cnpjEmpresa: string) {
    const usuario = await this.repository.buscarDaEmpresa(idUsuario, cnpjEmpresa);
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    // o dono sempre tem acesso total, então não faz sentido mudar perfil
    // nem desativar (senão a loja fica sem ninguém pra administrar)
    if (usuario.nivelAcesso === NIVEL_DONO && (dto.idPerfil !== undefined || dto.ativo === false)) {
      throw new BadRequestException('O administrador da loja sempre tem acesso total.');
    }

    if (dto.idPerfil !== undefined) {
      await this.validarPerfil(dto.idPerfil, cnpjEmpresa);
    }

    try {
      return await this.repository.atualizar(idUsuario, {
        nome: dto.nome?.trim(),
        login: dto.login?.trim(),
        emailUsuario: dto.emailUsuario?.trim().toLowerCase(),
        // senha é opcional na edição: só troca se o dono digitar uma nova
        senha: dto.senha ? await bcrypt.hash(dto.senha, 10) : undefined,
        idPerfil: dto.idPerfil,
        ativo: dto.ativo,
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Já existe um usuário com esse e-mail');
      }
      throw error;
    }
  }

  // impede usar perfil de outra loja
  private async validarPerfil(idPerfil: number, cnpjEmpresa: string) {
    const perfil = await this.perfilRepository.buscarPorId(idPerfil, cnpjEmpresa);
    if (!perfil) throw new BadRequestException('Perfil de acesso inválido');
  }
}