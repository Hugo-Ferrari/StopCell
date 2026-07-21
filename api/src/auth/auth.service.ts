import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UsuarioRepository } from '../usuario/usuario.repository';
import { CadastroDto } from './dto/Cadastro.dto';
import { LoginDto } from './dto/Login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usuarioRepository: UsuarioRepository,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: CadastroDto) {
    const senhaHash = await bcrypt.hash(dto.usuario.senha, 10);

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const empresaCriada = await tx.empresa.create({
          data: {
            cnpj: dto.empresa.cnpj,
            nomeFantasia: dto.empresa.nomeFantasia,
            razaoSocial: dto.empresa.razaoSocial,
            telefone: dto.empresa.telefone,
            endereco: dto.empresa.endereco,
          },
        });

        const usuarioCriado = await tx.usuario.create({
          data: {
            cnpjEmpresa: empresaCriada.cnpj,
            nome: dto.usuario.nome,
            login: dto.usuario.login,
            emailUsuario: dto.usuario.emailUsuario,
            senha: senhaHash,
            nivelAcesso: 'Dono',
          },
        });

        const usuarioSemSenha = { ...usuarioCriado } as Record<string, any>;
        delete usuarioSemSenha.senha;

        return {
          empresa: empresaCriada,
          usuario: usuarioSemSenha,
        };
      });

      return result;
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Email ou CNPJ já cadastrados');
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuarioRepository.findByEmail(dto.emailUsuario);
    const senhaCorreta = usuario ? await bcrypt.compare(dto.senha, usuario.senha ?? '') : false;

    if (!usuario || !senhaCorreta) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const token = this.jwt.sign(
      { sub: usuario.idUsuario, email: usuario.emailUsuario, cnpjEmpresa: usuario.cnpjEmpresa },
      { expiresIn: '8h' },
    );
    return { token };
  }
}
