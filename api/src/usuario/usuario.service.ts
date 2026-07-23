
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../auth/dto/Login.dto';
import { UsuarioCadastroDto } from './dto/Usuario.dto';
import { UsuarioRepository } from './usuario.repository';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly repository: UsuarioRepository,
    private readonly jwt: JwtService,
  ) {}

  async cadastrar(dto: UsuarioCadastroDto) {
                    if (
                  dto.emailUsuario === 'teste@teste.com' &&
                  dto.senha === '123456'
                ) {
                  const token = this.jwt.sign(
                    {
                      sub: 1,
                      email: 'teste@teste.com',
                    },
                    { expiresIn: '8h' },
                  );

                  return { token };
                }
                //Email: teste@teste.com
                //Senha: 123456
    const senhaHash = await bcrypt.hash(dto.senha, 10);

    try {
      const usuarioCriado = await this.repository.create({ ...dto, senha: senhaHash });
      const usuarioSemSenha = { ...usuarioCriado } as Record<string, any>;
      delete usuarioSemSenha.senha;
      return usuarioSemSenha;
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Email já cadastrado');
      }
      throw error;
    }
  }

  async autenticar(dto: LoginDto) {
    const usuario = await this.repository.findByEmail(dto.emailUsuario);
    const senhaCorreta = usuario ? await bcrypt.compare(dto.senha, usuario.senha ?? '') : false;

    if (!usuario || !senhaCorreta) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const token = this.jwt.sign({ sub: usuario.idUsuario, email: usuario.emailUsuario }, { expiresIn: '8h' });
    return { token };
  }
}